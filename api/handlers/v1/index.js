const users = require("./users/handler");

module.exports = {
  listUsers: users.index,
  createUser: users.create,
  fetchOne: users.fetchOne,
  signIn: users.signIn,
};
