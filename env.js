const { NODE_ENV, PORT } = process.env;

const isTestEnv = NODE_ENV === 'test';

module.exports = {
  isTestEnv,
  collection: isTestEnv ? 'Todo-test' : 'Todo',
  port: PORT || 5000,
};
