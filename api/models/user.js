const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Cannot be null.",
        },
        notEmpty: {
          msg: "Cannot be empty.",
        },
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Cannot be null.",
        },
        notEmpty: {
          msg: "Cannot be empty.",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE,
    },
    cognito_sub: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
  });
};
