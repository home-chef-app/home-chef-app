const sequelize = require("../../../models/database").sequelize;
const Sequelize = require("sequelize");
const {
  responseHandler,
  errorHandler,
} = require("../../../helpers/httpHelper");

const Users = require("../../../models/user")(sequelize, Sequelize);
Users.sync();

module.exports = {
  // GET /users
  async index(e, ctx, cb) {
    // console.log("E", e);
    try {
      const users = await Users.findAll();
      // const users = [
      //   {
      //     id: "123",
      //     email: "email",
      //     first_name: "Cormac",
      //     last_name: "Sewart",
      //   },
      // ];
      console.log(users);
      cb(null, responseHandler(200, users));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },

  // POST /books
  async create(e, ctx, cb) {
    const { first_name, last_name, email } = JSON.parse(e.body);

    try {
      const user = await Users.create({
        first_name,
        last_name,
        email,
      });

      cb(null, responseHandler(200, user));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },
};
