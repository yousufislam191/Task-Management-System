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
    allowNull: [false, "User name is required"],
    trim: true,
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [40, "Name should not exceed 40 characters"],
  },
  email: {
    type: DataTypes.STRING,
    allowNull: [false, "Email is required"],
    validate: {
      isEmail: true,
    },
    unique: {
      args: true,
      msg: "Email already exists",
    },
    lowercase: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: [false, "Password is required"],
    trim: true,
    validate: {
      isStrongPassword: true,
      len: {
        args: [8],
        msg: "Password must be 8 characters.",
      },
    },
    // set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
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
  },
});

module.exports = User;
