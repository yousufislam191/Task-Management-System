const {
  getUser,
  createNewUser,
  activateUserAccount,
  updateUserById,
  getUserById,
  deleteUserById,
} = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { signUpValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

userRouter.get("/", getUser);
userRouter.post("/register", signUpValidator, validationHandler, createNewUser);
userRouter.post("/verify-account", activateUserAccount);
userRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})",
  getUserById
);
userRouter.put(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})",
  updateUserById
);
userRouter.delete(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})",
  deleteUserById
);

module.exports = userRouter;
