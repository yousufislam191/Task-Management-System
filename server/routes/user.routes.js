const { getUser } = require("../controller/user.controllers");

const userRouter = require("express").Router();

userRouter.get("/", getUser);

module.exports = userRouter;
