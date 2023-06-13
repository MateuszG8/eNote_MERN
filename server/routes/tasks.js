const express = require("express");
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/").get(auth, getAllTasks).post(auth, createTask);
router.route("/:id").get(auth, getTask).patch(auth, updateTask).delete(auth, deleteTask);

module.exports = router;