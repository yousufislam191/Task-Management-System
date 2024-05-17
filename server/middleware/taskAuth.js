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
  check("hour")
    .notEmpty()
    .withMessage("Hour is required")
    .isInt()
    .withMessage("Hour should be an integer")
    .isInt({ min: 0, max: 23 })
    .withMessage("Hour should be between 0 and 12"),
  check("minute")
    .notEmpty()
    .withMessage("Minute is required")
    .isInt()
    .withMessage("Minute should be an integer")
    .isInt({ min: 0, max: 59 })
    .withMessage("Minute should be between 0 and 59"),
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
