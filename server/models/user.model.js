const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
    validate: {
      notNull: {
        msg: "User name is required",
      },
      len: {
        args: [3, 40],
        msg: "Name must be 3 to 40 characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: [false, "Email is required"],
    validate: {
      isEmail: {
        msg: "Please enter a valid Email address",
      },
      isLowercase: true,
    },
    unique: {
      args: true,
      msg: "Email already exists",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: [false, "Password is required"],
    trim: true,
    validate: {
      min: {
        args: 8,
        msg: "Password length must be more than 8 characters",
      },
    },
    set(value) {
      this.setDataValue(
        "password",
        bcrypt.hashSync(value, bcrypt.genSaltSync(10))
      );
    },
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = User;
