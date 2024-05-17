const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
} = require("../controller/auth.controller");
const { validationHandler } = require("../middleware");
const { isLoggedOut, isLoggedIn } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { signInValidator } = require("../middleware/userAuth");

const authRouter = require("express").Router();

authRouter.post(
  "/login",
  loginLimiter,
  signInValidator,
  validationHandler,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtectedRoute);
module.exports = authRouter;
