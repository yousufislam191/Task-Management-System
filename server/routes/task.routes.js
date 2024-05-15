const {
  createNewTask,
  deleteTaskById,
  getTaskById,
  editTaskById,
  editTaskStatusById,
  getAllTaskForSingleUser,
  searchTasksByUserNameAndStatus,
  getAllTasks,
} = require("../controller/task.controller");
const { validationHandler } = require("../middleware");
const { isLoggedIn, checkIsAdmin } = require("../middleware/auth");
const { createTaskValidator } = require("../middleware/taskAuth");
const { uuidRegex } = require("../secret");

const taskRouter = require("express").Router();

taskRouter.get("/:status?", isLoggedIn, checkIsAdmin, getAllTasks);
taskRouter.get(`/:id(${uuidRegex})`, isLoggedIn, getTaskById);
taskRouter.get(
  `/user-all-task/:id(${uuidRegex})/:status?`,
  isLoggedIn,
  getAllTaskForSingleUser
);
taskRouter.post(
  "/create-task",
  isLoggedIn,
  createTaskValidator,
  validationHandler,
  checkIsAdmin,
  createNewTask
);
taskRouter.post(
  "/search",
  isLoggedIn,
  checkIsAdmin,
  searchTasksByUserNameAndStatus
);
taskRouter.delete(
  `/:id(${uuidRegex})`,
  isLoggedIn,
  checkIsAdmin,
  deleteTaskById
);
taskRouter.put(`/:id(${uuidRegex})`, isLoggedIn, checkIsAdmin, editTaskById);
taskRouter.put(`/status/:id(${uuidRegex})`, isLoggedIn, editTaskStatusById);

module.exports = taskRouter;
