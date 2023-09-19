const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user.model");

const Task = sequelize.define("tasks", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
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
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 3,
    },
  },
  createdByTask: {
    type: DataTypes.UUID,
    allowNull: false,
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
  //   comment: {
  //     type: DataTypes.JSON,
  //     allowNull: true,
  //     defaultValue: [],
  //     // {
  //     //   userId: DataTypes.UUID,
  //     //   allowNull: true,
  //     //   references: {
  //     //     model: User,
  //     //     key: "id",
  //     //   },
  //     //   timestamps: true,
  //     // },
  //   },
});

// Define associations between Task and User
Task.belongsTo(User, { as: "createdBy", foreignKey: "createdByTask" });
Task.belongsTo(User, { as: "createdTo", foreignKey: "createdToTask" });

module.exports = Task;
