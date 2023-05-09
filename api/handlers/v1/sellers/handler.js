const { models } = require("../../../models/database");
const Sellers = models.seller;
const {
  responseHandler,
  errorHandler,
} = require("../../../helpers/httpHelper");
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
    const host = "";
    const index = "sellers";
    const url = host + "/" + index + "/_search";

    // @todo pass from client
    const lat = 45.96;
    const lon = -66.64;
    console.log(e.pathParameters);
    const queryValue = e?.pathParameters?.query;
    const sortValue = e?.pathParameters?.sort;
    try {
      let query = {
        size: 25,
        query: {
          bool: {
            filter: {
              geo_distance: {
                distance: "1000km",
                location: {
                  lat,
                  lon,
                },
              },
            },
          },
        },
      };

      // If there is a string query, filter on it
      if (!!queryValue) {
        query.query.bool["must"] = {
          query_string: {
            query: `*${queryValue.trim()}*`,
            fields: ["name^2", "description"],
            fuzziness: "AUTO",
          },
        };
      }

      //Apply the specified sorting option
      switch (sortValue) {
        case "mostPopular":
          // code block
          break;
        case "highestRating":
          // code block
          break;
        case "proximity":
          query["sort"] = [
            {
              _geo_distance: {
                location: [lat, lon],
                order: "desc",
                unit: "km",
                distance_type: "arc",
                mode: "min",
                ignore_unmapped: true,
              },
            },
          ];
          break;
        default:
          query["sort"] = [
            {
              _geo_distance: {
                location: [lat, lon],
                order: "desc",
                unit: "km",
                distance_type: "arc",
                mode: "min",
                ignore_unmapped: true,
              },
            },
          ];
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
