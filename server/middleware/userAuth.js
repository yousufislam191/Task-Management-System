const { check } = require("express-validator");
const createError = require("http-errors");
const User = require("../models/user.model");

const signUpValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 40 })
    .withMessage("Name should be between 3 and 40 characters")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name should only contain alphabet and space")
    .escape(),
  check("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Invalid email address")
    .escape()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ where: { email: value } });
        if (existingUser) {
          throw createError(409, "User already exists. Please sign in");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .isStrongPassword()
    .withMessage(
      "Password is not a strong. Must be one uppercase, lowercase, number and special characters"
    ),
];

const signInValidator = [
  check("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is missing")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Invalid email address"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Invalid password"),
];

const passwordUpdateInValidator = [
  check("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is missing")
    .isLength({ min: 8 })
    .withMessage("Old password must have at least 8 characters"),
  check("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is missing")
    .isLength({ min: 8 })
    .withMessage("New password must have at least 8 characters")
    .isStrongPassword()
    .withMessage(
      "New password is not a strong. Must be one uppercase, lowercase, number and special characters"
    ),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is missing")
    .isLength({ min: 8 })
    .withMessage("Confirm password must have at least 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm password does not match with new password");
      }
      return true;
    }),
];

const forgetPasswordValidator = [
  check("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is missing")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Invalid email address"),
];

const resetPasswordValidator = [
  check("token").trim().notEmpty().withMessage("Token is missing"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters")
    .isStrongPassword()
    .withMessage(
      "Password is not a strong. Must be one uppercase, lowercase, number and special characters"
    ),
];

module.exports = {
  signUpValidator,
  signInValidator,
  passwordUpdateInValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
};
