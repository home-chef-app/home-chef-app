const sequelize = require("../../../models/database").sequelize;
const Sequelize = require("sequelize");
const { responseHandler, errorHandler } = require("../../../helpers/httpHelper");

const Users = require("../../../models/user")(sequelize, Sequelize);
Users.sync();

module.exports = {
  // GET /users
  async index(e, ctx, cb) {
    console.log("E", e);
    try {
      const users = await Users.findAll();
      console.log(users);
      cb(null, responseHandler(200, users));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },

  // POST /books
  async create(e, ctx, cb) {
    console.log("E", e);
    cb(null, responseHandler(200, "test"));
    // try {
    //   const book = await Book.create({
    //     title,
    //     description,
    //   });

    //   cb(null, responseHandler(200, book));
    // } catch (error) {
    //   cb(null, errorHandler(400, error));
    // }
  },
};
