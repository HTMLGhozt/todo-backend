process.env.NODE_ENV = 'test';
const request = require('supertest');

const db = require('../db');
const app = require('../app');

const collection = 'Todo-test';
const todos = [
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
];
const todoTemplate = todos[0];

beforeAll(() => {
  db.addCollection(collection, {
    unique: ['text'],
    exact: ['completed'],
    clone: true,
  });
});

afterAll(done => {
  db.removeCollection(collection);
  db.close(done);
});

afterEach(() => {
  db.getCollection(collection).clear({ removeIndices: true });
});

describe('API Integration tests', () => {
  // seed data
  beforeEach(() => {
    db.getCollection(collection).insert(todos);
    db.saveDatabase();
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

      const deletedTodo = db.getCollection(collection).get(2);
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

      const newTodo = db.getCollection(collection).get(4);

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

      const newTodo = db.getCollection(collection).get(4);

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
});

describe('DB Unit tests', () => {
  describe('Todo database', () => {
    test('It should shallow copy objects inserted into it', () => {
      const todo = { ...todoTemplate };
      db.getCollection(collection).insert(todo);

      expect(todo).toStrictEqual(todoTemplate);
    });

    // test('It should not allow insertion without the `text` parameter', () => {
    //   //todo
    // });
  });
});
