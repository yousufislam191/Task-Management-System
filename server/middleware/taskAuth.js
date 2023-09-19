const { check } = require("express-validator");
const createError = require("http-errors");
const User = require("../models/user.model");

const createTaskValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title should be between 3 and 50 characters")
    .escape(),
  check("tag")
    .trim()
    .notEmpty()
    .withMessage("Tag is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Tag should be between 3 and 30 characters")
    .escape(),
  check("description")
    .trim()
    .notEmpty()
    .withMessage("Task description is required")
    .escape(),
  check("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Invalid deadline format. Use ISO8601 date format."),
  check("createdToTask")
    .notEmpty()
    .withMessage("createdToTask is required")
    .isUUID()
    .withMessage("Invalid createdToTask value")
    .custom(async (value) => {
      try {
        const user = await User.findByPk(value);
        if (!user) {
          throw createError(
            400,
            "Invalid createdToTask value. User not found."
          );
        }
      } catch (err) {
        throw createError(500, err.message);
      }
    }),
];

module.exports = {
  createTaskValidator,
};
