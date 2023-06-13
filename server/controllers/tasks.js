const {User} = require('../models/user');
const Task = require('../models/task'); 
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-errors");

// Pobiera wszystkie zadania dla aktualnie zalogowanego użytkownika
const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }); // Szuka zadań, gdzie user jest równy id aktualnie zalogowanego użytkownika
  res.status(200).json({ tasks });
});

// Tworzy nowe zadanie dla aktualnie zalogowanego użytkownika
const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id }); // Tworzy nowe zadanie z przesłanymi danymi i dodaje id zalogowanego użytkownika
  res.status(201).json(task);
});

// Pobiera pojedyncze zadanie dla aktualnie zalogowanego użytkownika
const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params; // Pobiera id zadania z parametrów
  const task = await Task.findOne({ _id: taskID, user: req.user._id }); // Szuka zadania o danym id, które należy do aktualnie zalogowanego użytkownika
  if (!task) {
    return next(createCustomError(`No task with id: ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

// Aktualizuje pojedyncze zadanie dla aktualnie zalogowanego użytkownika
const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params; // Pobiera id zadania z parametrów
  const task = await Task.findOneAndUpdate({ _id: taskID, user: req.user._id }, req.body, { // Szuka zadania o danym id, które należy do aktualnie zalogowanego użytkownika i aktualizuje go
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id: ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

// Usuwa pojedyncze zadanie dla aktualnie zalogowanego użytkownika
const deleteTask = async (req, res) => {
  try {
    const { id: taskID } = req.params; // Pobiera id zadania z parametrów
    const task = await Task.findOneAndDelete({ _id: taskID, user: req.user._id }); // Szuka zadania o danym id, które należy do aktualnie zalogowanego użytkownika i usuwa go
    if (!task) {
      return next(createCustomError(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
