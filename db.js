const loki = require('lokijs');

const db = new loki('db.json', {
  autosave: true,
  autoload: true,
  env: 'NODEJS',
  throttledSaves: true,
});

if (process.env.NODE_ENV !== 'test') {
  db.addCollection('Todo', {
    unique: ['text'],
    exact: ['completed'],
  });
}

module.exports = db;
