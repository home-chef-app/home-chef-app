const sequelize = require("../../../models/database").sequelize;
const Sequelize = require("sequelize");
const {
  responseHandler,
  errorHandler,
} = require("../../../helpers/httpHelper");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
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

  // POST /users
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

  // POST /users/{sub}
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
      const sub = signInResult.idToken.payload.sub;
      console.log("Sub", sub);
      // DB Call
      // const user = await Users.findAll({
      //   where: {
      //     cognito_sub: "7d781aa6-a11f-4f77-b58e-42f92c3efbdb",
      //   },
      // });
      cb(null, responseHandler(200, { ...signInResult }));
    } catch (error) {
      console.log(error);
      cb(null, errorHandler(400, error));
    }
  },
};
