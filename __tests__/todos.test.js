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
});

afterEach(async () => {
  const todos = db.getCollection('Todo-test');

  // passing in a callback function makes removeWhere an abstraction
  // to the JavaScript `.filter` method.
  todos.removeWhere(() => true);
});

afterAll(async () => {
  db.removeCollection('Todo-test');
  db.close();
});

describe('GET /api/todos', () => {
  test('It responds with an array of todos', async () => {
    const response = await request(app).get('/api/todos');
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toHaveProperty('test');
    expect(response.body[0]).toHaveProperty('completed');
    expect(response.statusCode).toBe(200);
  });
});
