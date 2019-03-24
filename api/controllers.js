const { db } = require('../db');

function getUsers(req, res) {
  const userList = db.getCollection('User').data;

  res.status(200).json(userList);
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await db.getCollection('User').get(+id);

    res.status(200).json({ user });
  } catch (error) {
    res.status(422).json({ error: "couldn't get user" });
  }
}

async function postUser(req, res) {
  const { username, password } = req.body;
  try {
    const newUser = db.getCollection('User').insert({ username, password });

    await db.saveDatabase();

    res.status(201).json({
      status: 'success',
      userId: newUser.$loki,
    });
  } catch (error) {
    res.status(500).json({ error: "couldn't save user" });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    db.getCollection('User').findAndRemove({ $loki: +id });

    await db.saveDatabase();

    res.status(202).json({
      status: 'success',
      id,
    });
  } catch (error) {
    res.status(500).json({ error: "couldn't delete user" });
  }
}

module.exports = {
  getUsers,
  getUserById,
  postUser,
  deleteUser,
};
