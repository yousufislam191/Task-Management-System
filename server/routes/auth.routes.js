const { handleLogin, handleLogout } = require("../controller/auth.controller");
const { validationHandler } = require("../middleware");
const { isLoggedOut, isLoggedIn } = require("../middleware/auth");
const { signInValidator } = require("../middleware/userAuth");

const authRouter = require("express").Router();

authRouter.post(
  "/login",
  signInValidator,
  validationHandler,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);
module.exports = authRouter;
