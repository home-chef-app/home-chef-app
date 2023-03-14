const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL,
  tokenUse: "access",
  clientId: process.env.COGNITO_USER_POOL_CLIENT,
});
module.exports = {
  verifyJwtToken: async (token) => {
    try {
      const payload = await verifier.verify(token);
      return true;
    } catch {
      return false;
    }
  },
};
