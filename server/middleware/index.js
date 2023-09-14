const { validationResult } = require("express-validator");
const { errorResponse } = require("../controller/response.controller");

const validationHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // If the validation fails then file will be deleted
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: errors.mapped(),
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};
module.exports = { validationHandler };
