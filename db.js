const loki = require('lokijs');

const db = new loki('db.json', {
  autosave: true,
  autoload: true,
  throttledSaves: true,
});

const users = db.addCollection('User', {
  unique: ['username'],
  exact: ['password']
});

module.exports = { db };
