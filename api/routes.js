const {
  getUsers,
  getUserById,
  postUser,
  deleteUser,
} = require('./controllers');

module.exports = app => {
  app
    .route('/api/users')
    .get(getUsers)
    .post(postUser);

  app
    .route('/api/users/:id')
    .get(getUserById)
    // .put(updateUser)
    .delete(deleteUser);
};
