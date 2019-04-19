const {
  getTodos,
  getTodoById,
  updateTodo,
  postTodo,
  deleteTodo,
} = require('./controllers');

module.exports = app => {
  app
    .route('/api/todos')
    .get(getTodos)
    .post(postTodo);

  app
    .route('/api/todos/:id')
    .get(getTodoById)
    .put(updateTodo)
    .delete(deleteTodo);
};
