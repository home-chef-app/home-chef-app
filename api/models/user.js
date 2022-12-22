module.exports = (sequelize, { DataTypes }) => {
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
    email: {
      type: DataTypes.STRING,
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
  });
};
