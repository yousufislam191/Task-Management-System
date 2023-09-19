const { createNewTask, getTask } = require("../controller/task.controller");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const taskRouter = require("express").Router();

taskRouter.get("/", isLoggedIn, isAdmin, getTask);
taskRouter.post("/create-task", createNewTask);

module.exports = taskRouter;
