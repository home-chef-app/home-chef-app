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
    // Commenting until I can figure out the data transfer charges
    //const host = "https://search-home-chef-dev-jsck72zarjgrmtoypfpjtyxcqu.us-east-1.es.amazonaws.com";
    const host = ""
    const index = "sellers";
    const url = host + "/" + index + "/_search";
    console.log(e.pathParameters);
    const queryValue = e?.pathParameters?.query;
    try {
      let query = {
        size: 25,
        query: {
          bool: {
            filter: {
              geo_distance: {
                distance: "1000km",
                location: {
                  lat: 45.96,
                  lon: -66.64,
                },
              },
            },
          },
        },
      };
      if (!!queryValue) {
        query.query.bool["must"] = {
          query_string: {
            query: `*${queryValue.trim()}*`,
            fields: ["name^2", "description"],
            fuzziness: "AUTO",
          },
        };
      }
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
