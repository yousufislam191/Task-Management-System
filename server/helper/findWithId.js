const createError = require("http-errors");
const { sequelize } = require("../config/db");

const findWithId = async (Model, id, attributes = {}) => {
  try {
    const item = await Model.findByPk(id, { attributes: attributes });
    if (!item)
      throw createError(404, `${Model.modelName} does not exist with this id`);
    return item;
  } catch (error) {
    if (error instanceof sequelize.BaseError) {
      throw createError(400, `Invalid ${Model.name} Id`);
    }
    throw error;
  }
};
module.exports = { findWithId };
