const {
  getUser,
  createNewUser,
  activateUserAccount,
  updateUserById,
  getUserById,
  deleteUserById,
} = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const { signUpValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

userRouter.get("/", isLoggedIn, isAdmin, getUser);
userRouter.post(
  "/register",
  isLoggedOut,
  signUpValidator,
  validationHandler,
  createNewUser
);
userRouter.post("/verify-account", isLoggedOut, activateUserAccount);
userRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})",
  isLoggedIn,
  getUserById
);
userRouter.put(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})",
  isLoggedIn,
  updateUserById
);
userRouter.delete(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})",
  isLoggedIn,
  deleteUserById
);

module.exports = userRouter;
