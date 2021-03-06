const loki = require('lokijs');

const { isTestEnv } = require('./env');

const db = new loki('db/db.json', {
  autosave: true,
  autoload: true,
  env: 'NODEJS',
  throttledSaves: true,
  serializationMethod: isTestEnv ? 'pretty' : 'normal',
  verbose: isTestEnv,
});

db.addCollection('Todo', {
  unique: ['text'],
  exact: ['completed'],
  clone: true,
  asyncListeners: isTestEnv,
});

module.exports = db;
