const sequelize = require("../../../models/database").sequelize;
const Sequelize = require("sequelize");
const {
  responseHandler,
  errorHandler,
} = require("../../../helpers/httpHelper");
const Sellers = require("../../../models/seller")(sequelize, Sequelize);
Sellers.sync();
const SearchClient = require("../../../models/search");
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

  // GET /sellers/search/{query}
  async search(e, ctx, cb) {
    const host =
      "https://search-home-chef-dev-jsck72zarjgrmtoypfpjtyxcqu.us-east-1.es.amazonaws.com";
    const index = "sellers";
    const url = host + "/" + index + "/_search";
    console.log(e.pathParameters);
    const queryValue = e.pathParameters.query;
    try {
      const query = {
        size: 25,
        query: {
          multi_match: {
            query: queryValue,
            fields: ["name", "description"],
            fuzziness: "AUTO",
          },
        },
      };
      // const result = await fetch(url, {
      //   method: "POST",
      //   body: JSON.stringify(query),
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     Authorization: {
      //       user,
      //     },
      //   },
      // });
      var response = await SearchClient.search({
        index: "sellers",
        body: query,
      });
      console.log(response.body.hits);

      cb(null, responseHandler(200, response.body.hits));
    } catch (error) {
      console.log(error);
      cb(null, errorHandler(400, error));
    }
  },
};
