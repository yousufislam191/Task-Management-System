const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user.model");

const FailedTask = sequelize.define("failedTasks", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
      notNull: {
        msg: "User email is required",
      },
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
    validate: {
      notNull: {
        msg: "Title is required",
      },
      len: {
        args: [3, 50],
        msg: "Title should be contained 3 to 50 characters",
      },
    },
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
    validate: {
      notNull: {
        msg: "Tag is required",
      },
      len: {
        args: [3, 30],
        msg: "Tag should be contained 3 to 30 characters",
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    trim: true,
    validate: {
      notNull: {
        msg: "Task description is required",
      },
    },
  },
  deadline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 23,
      notNull: {
        msg: "Hour is required",
      },
    },
  },
  minute: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 59,
      notNull: {
        msg: "Minute is required",
      },
    },
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  createdByTask: {
    type: DataTypes.UUID,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: User,
      key: "id",
    },
    validate: {
      async isValidCreatedByTask(value) {
        const user = await User.findByPk(value);
        if (!user) {
          throw new Error("Invalid createdByTask value. User not found.");
        }
      },
    },
  },
  createdToTask: {
    type: DataTypes.UUID,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: User,
      key: "id",
    },
    validate: {
      async isValidCreatedToTask(value) {
        const user = await User.findByPk(value);
        if (!user) {
          throw new Error("Invalid createdToTask value. User not found.");
        }
      },
    },
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

FailedTask.belongsTo(User, { as: "createdBy", foreignKey: "createdByTask" });
FailedTask.belongsTo(User, { as: "createdTo", foreignKey: "createdToTask" });

module.exports = FailedTask;
