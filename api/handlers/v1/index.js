const users = require("./users/handler");

module.exports = {
  listUsers: users.index,
  createUser: users.create,
};
