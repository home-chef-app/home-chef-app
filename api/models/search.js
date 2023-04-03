const { Client } = require("@opensearch-project/opensearch");

const client = new Client({
  auth: {
    username: "home-chef-admin",
    password: "H0mechef!",
  },
  node: "https://search-home-chef-dev-jsck72zarjgrmtoypfpjtyxcqu.us-east-1.es.amazonaws.com",
});
module.exports = client;
