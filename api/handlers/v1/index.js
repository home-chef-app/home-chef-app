const users = require("./users/handler");
const sellers = require("./sellers/handler");

module.exports = {
  listUsers: users.index,
  fetchOne: users.fetchOne,
  signIn: users.signIn,
  signUp: users.signUp,
  confirm: users.confirmSignup,
  resend: users.resendCode,
  refreshIdToken: users.refreshIdToken,
  tokenTest: users.tokenTest,
  //Sellers
  listSellers: sellers.index,
};
