const db = require('../db');
const { collection } = require('../env');

function getTodos(_, res) {
  const { data: todoList } = db.getCollection(collection);

  res.status(200).json(todoList);
}

function getTodoById(req, res) {
  const { id } = req.params;
  try {
    const todo = db.getCollection(collection).get(+id);

    if (!todo) throw new Error();

    res.status(200).json({ todo });
  } catch (error) {
    res.status(422).json({ error: "couldn't get todo" });
  }
}

function postTodo(req, res) {
  const { text, completed } = req.body;
  try {
    if (!text) {
      throw new Error();
    }
    const newTodo = db
      .getCollection(collection)
      .insert([{ text, completed: completed || false }]);

    db.saveDatabase();

    res.status(201).json({
      status: 'success',
      todoId: newTodo.$loki,
    });
  } catch (error) {
    res.status(500).json({ error: "couldn't save todo" });
  }
}

function deleteTodo(req, res) {
  const { id } = req.params;
  try {
    db.getCollection(collection).remove(+id);

    db.saveDatabase();

    res.status(202).json({
      status: 'success',
      id,
    });
  } catch (error) {
    res.status(404).json({ error: "couldn't delete todo" });
  }
}

module.exports = {
  getTodos,
  getTodoById,
  postTodo,
  deleteTodo,
};
