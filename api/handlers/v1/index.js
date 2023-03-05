const users = require("./users/handler");

module.exports = {
  listUsers: users.index,
  fetchOne: users.fetchOne,
  signIn: users.signIn,
  signUp: users.signUp,
  confirm: users.confirmSignup,
  resend: users.resendCode,
  refreshIdToken: users.refreshIdToken,
  tokenTest: users.tokenTest,
};
