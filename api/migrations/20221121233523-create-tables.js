"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      cognito_sub: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
    });
    await queryInterface.createTable("sellers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      location: {
        type: Sequelize.GEOMETRY,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("dishes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sellers",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("ratings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sellers",
          key: "id",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      review: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryInterface.sequelize.sync({ force: true });
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("sellers");
    await queryInterface.dropTable("dishes");
    await queryInterface.dropTable("ratings");
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    await queryInterface.sequelize.sync({ force: true });
  },
};
