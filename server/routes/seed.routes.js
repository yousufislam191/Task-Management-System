const { seedUser, seedTask } = require("../controller/seed.controllers");

const seedRouter = require("express").Router();

seedRouter.get("/users", seedUser);
seedRouter.get("/tasks", seedTask);

module.exports = seedRouter;
