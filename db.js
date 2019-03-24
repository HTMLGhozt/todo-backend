const loki = require('lokijs');

const db = new loki('db.json', {
  autosave: true,
  autoload: true,
  throttledSaves: true,
});

db.addCollection('User', {
  unique: ['username'],
  exact: ['password'],
});

module.exports = { db };
