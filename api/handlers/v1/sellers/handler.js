const sequelize = require("../../../models/database").sequelize;
const Sequelize = require("sequelize");
const {
  responseHandler,
  errorHandler,
} = require("../../../helpers/httpHelper");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const Sellers = require("../../../models/seller")(sequelize, Sequelize);
Sellers.sync();

module.exports = {
  // GET /sellers
  async index(e, ctx, cb) {
    try {
      const sellers = await Sellers.findAll();
      cb(null, responseHandler(200, sellers));
    } catch (error) {
      cb(null, errorHandler(400, error));
    }
  },
};
