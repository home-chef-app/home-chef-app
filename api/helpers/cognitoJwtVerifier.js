import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL,
  tokenUse: "access",
  clientId: process.env.COGNITO_USER_POOL_CLIENT,
});
export const verifyJwtToken = async (token) => {
  try {
    const payload = await verifier.verify(token);
    console.log("Token is valid", payload);
    return true;
  } catch {
    return false;
  }
};
