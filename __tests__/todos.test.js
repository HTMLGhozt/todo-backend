process.env.NODE_ENV = 'test';
const request = require('supertest');

const db = require('../db');
const app = require('../app');

beforeAll(async () => {
  db.addCollection('Todo-test', {
    unique: ['text'],
    exact: ['completed'],
  });
});

beforeEach(async () => {
  const todos = db.getCollection('Todo-test');

  todos.insert([
    {
      text: 'dishes',
      completed: false,
    },
    {
      text: 'groceries',
      completed: false,
    },
    {
      text: 'laundry',
      completed: true,
    },
  ]);

  db.saveDatabase();
});

afterEach(async () => {
  const todos = db.getCollection('Todo-test');
  todos.clear({ removeIndices: true });
});

afterAll(async () => {
  db.removeCollection('Todo-test');
  db.close();
});

describe('GET /api/todos', () => {
  test('It responds with an array of todos', async () => {
    const { body, statusCode } = await request(app).get('/api/todos');

    expect(body.length).toBe(3);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.any(String),
          completed: expect.any(Boolean),
          $loki: expect.any(Number),
        }),
      ]),
    );
    expect(statusCode).toBe(200);
  });
});

describe('GET /api/todos/:id', () => {
  test('It responds with a todo object with the the correct id', async () => {
    const { body, statusCode } = await request(app).get('/api/todos/2');

    expect(body.todo).toEqual(
      expect.objectContaining({
        text: 'groceries',
        completed: false,
        $loki: 2,
      }),
    );
    expect(statusCode).toBe(200);
  });

  test("It should fail if the id doesn't exist", async () => {
    const { statusCode } = await request(app).get('/api/todos/10');

    expect(statusCode).toBe(422);
  });
});

describe('DELETE /api/todos/:id', () => {
  test('It deletes the correct todo given a valid id', async () => {
    const { statusCode } = await request(app).delete('/api/todos/2');
    expect(statusCode).toBe(202);

    const deletedTodo = db.getCollection('Todo-test').get(2);
    expect(deletedTodo).toBe(null);
  });

  test("It should fail if the id doesn't exist", async () => {
    const { statusCode } = await request(app).delete('/api/todos/10');

    expect(statusCode).toBe(404);
  });
});

describe('POST /api/todos', () => {
  test('It adds a new todo', async () => {
    const todo = {
      text: 'testing todo',
      completed: false,
    };
    const { statusCode } = await request(app)
      .post('/api/todos')
      .send(todo);

    expect(statusCode).toBe(201);

    const newTodo = db.getCollection('Todo-test').get(4);

    expect(newTodo).toEqual(
      expect.objectContaining({
        ...todo,
        $loki: 4,
      }),
    );
  });

  test('`completed` defaults to false', async () => {
    const todo = { text: 'completed should be false' };
    const { statusCode } = await request(app)
      .post('/api/todos')
      .send(todo);

    expect(statusCode).toBe(201);

    const newTodo = db.getCollection('Todo-test').get(4);

    expect(newTodo).toEqual(
      expect.objectContaining({
        ...todo,
        completed: false,
        $loki: 4,
      }),
    );
  });

  test('It fails if no `text` is passed in', async () => {
    const todo = {};
    const { statusCode } = await request(app)
      .post('/api/todos')
      .send(todo);

    // TODO: This shouldn't return 500, it should be a malformed query.
    expect(statusCode).toBe(500);
  });
});
