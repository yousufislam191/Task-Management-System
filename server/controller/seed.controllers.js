const data = require("../data");
const User = require("../models/user.model");

const seedUser = async (req, res, next) => {
  try {
    // deleting all existing users
    await User.destroy({ where: {} });

    // inserting new users
    const newuser = await User.bulkCreate(data.users);

    // successfull response
    return res.status(201).json(newuser);
  } catch (error) {
    next(error);
  }
};
module.exports = { seedUser };
