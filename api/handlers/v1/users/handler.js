const sequelize = require("../../../models/database").sequelize;
const Sequelize = require("sequelize");
const {
  responseHandler,
  errorHandler,
} = require("../../../helpers/httpHelper");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const Users = require("../../../models/user")(sequelize, Sequelize);
Users.sync();
const { verifyJwtToken } = require("../../../helpers/cognitoJwtVerifier");

module.exports = {
  // GET /users
  async index(e, ctx, cb) {
    try {
      const users = await Users.findAll();
      cb(null, responseHandler(200, users));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },

  // GET /users/{sub}
  async fetchOne(e, ctx, cb) {
    console.log(e);
    const { sub } = JSON.parse(e.pathParameters);

    try {
      const user = await Users.findOne({
        where: {
          cognito_sub: sub,
        },
      });

      cb(null, responseHandler(200, user));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },

  // POST /users/signin
  async signIn(e, ctx, cb) {
    const { phone, password } = JSON.parse(e.body);

    try {
      var authenticationData = {
        Username: phone,
        Password: password,
      };

      var authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT,
      });
      var userData = {
        Username: phone,
        Pool: userPool,
      };

      cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      function signInRequest(authDetails) {
        return new Promise(function (resolve, reject) {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: resolve,
            onFailure: reject,
          });
        });
      }
      const signInResult = await signInRequest(authenticationDetails);
      console.log(signInResult);
      const sub = signInResult.idToken.payload.sub;
      console.log("Sub", sub);

      const user = await Users.findOne({
        where: {
          cognito_sub: sub,
        },
      });

      if (!user) {
        cb(null, responseHandler(404, { message: "User not found" }));
        return;
      }

      cb(null, responseHandler(200, { ...user.dataValues, ...signInResult }));
    } catch (error) {
      console.log(error);
      cb(null, errorHandler(500, error));
    }
  },

  // POST /users/signin
  async signUp(e, ctx, cb) {
    const { phone, password } = JSON.parse(e.body);

    try {
      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT,
      });
      var userData = {
        Username: phone,
        Pool: userPool,
      };

      cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      let userAttributes = [];
      var dataPhoneNumber = {
        Name: "phone_number",
        Value: phone,
      };
      var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataPhoneNumber
      );

      userAttributes.push(attributePhoneNumber);

      console.log(userAttributes);

      userPool.signUp(
        phone,
        password,
        userAttributes,
        null,

        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          var cognitoUser = result.user;
          console.log(
            "user name is " + cognitoUser.getUserData((r) => console.log(r))
          );
        }
      );

      /*   const user = await Users.create({
        first_name,
        last_name,
        phone,
        cognito_sub,
      }); */

      cb(null, responseHandler(200, { test: "Test" }));
    } catch (error) {
      console.log("ERROR", error);
      cb(null, errorHandler(500, error));
    }
  },

  // POST /users/signin
  async confirmSignup(e, ctx, cb) {
    const { first_name, last_name, phone, password, code } = JSON.parse(e.body);

    try {
      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT,
      });
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: phone,
        Pool: userPool,
      });

      function confirm() {
        return new Promise(function (resolve, reject) {
          cognitoUser.confirmRegistration(code, true, function (err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
      }
      const result = await confirm();

      var authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails({
          Username: phone,
          Password: password,
        });
      function signInRequest(authDetails) {
        return new Promise(function (resolve, reject) {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: resolve,
            onFailure: reject,
          });
        });
      }
      const signInResult = await signInRequest(authenticationDetails);

      const sub = signInResult.idToken.payload.sub;
      const user = await Users.create({
        first_name,
        last_name,
        phone,
        cognito_sub: sub,
      });
      console.log(user.dataValues);
      cb(null, responseHandler(200, { ...user.dataValues, ...signInResult }));
    } catch (error) {
      console.log("ERROR", error);
      cb(null, errorHandler(500, error));
    }
  },

  // POST /users/signin
  async resendCode(e, ctx, cb) {
    const { phone } = JSON.parse(e.body);
    try {
      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT,
      });
      var userData = {
        Username: phone,
        Pool: userPool,
      };

      cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      function resend() {
        return new Promise(function (resolve, reject) {
          cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
      }
      const result = await resend();

      cb(null, responseHandler(200, { result: result }));
    } catch (error) {
      console.log("ERROR", error);
      cb(null, errorHandler(500, error));
    }
  },

  // PUT /users/refreshToken
  async refreshIdToken(e, ctx, cb) {
    const { phone, refreshToken } = JSON.parse(e.body);

    try {
      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT,
      });
      var userData = {
        Username: phone,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      const token = new AmazonCognitoIdentity.CognitoRefreshToken({
        RefreshToken: refreshToken,
      });

      function refresh() {
        return new Promise(function (resolve, reject) {
          cognitoUser.refreshSession(token, (err, session) => {
            if (err) {
              reject(err);
            } else {
              resolve(session);
            }
          });
        });
      }
      const {
        accessToken: { jwtToken },
      } = await refresh();
      cb(null, responseHandler(200, { result: jwtToken }));
    } catch (error) {
      console.log("ERROR", error);
      cb(null, errorHandler(500, error));
    }
  },

  async tokenTest(e, ctx, cb) {
    try {
      const token = e.headers.authorization.replace("Bearer ", "");
      const validToken = await verifyJwtToken(token);
      if (!validToken) {
        console.log("invalid token");
        cb(null, responseHandler(403, { message: "Unauthorized" }));
        return;
      }
      console.log("valid token");
      cb(null, responseHandler(200, { message: "success" }));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },
};
