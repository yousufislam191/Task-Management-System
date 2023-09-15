const createError = require("http-errors");

const findWithEmail = async (Model, email, next) => {
  try {
    const user = await Model.findOne({ where: { email: email } });
    if (!user) {
      throw createError(
        404,
        `User doesn't exist with this email ${email} address. Please register first`
      );
    }
    return user;
  } catch (error) {
    next(error);
  }
};
module.exports = { findWithEmail };
