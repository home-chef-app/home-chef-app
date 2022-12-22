"use strict";

//const fs = require("fs");
//const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
//const basename = path.basename(__filename);
//const env = process.env.NODE_ENV || "dev";
const db = {};
// const yaml = require("js-yaml");
// const file = fs.readFileSync(path.resolve(__dirname, "../config/dev/vars.yml"));
// const doc = yaml.load(file, "utf8");
// console.log("RESULT", doc);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: "mysql",
    pool: { maxConnections: 10, maxIdleTime: 30 },
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true,
    },
  }
);

// //Find all models from files, and assign them to db
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach((file) => {
//     try {
//       const model = require(path.join(__dirname, file))(
//         sequelize,
//         Sequelize.DataTypes
//       );
//       db[model.name] = model;
//     } catch (e) {
//       console.log("ERROR", e);
//     }
//   });

// //Iterate all model assocation functions
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
