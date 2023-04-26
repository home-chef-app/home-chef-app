("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        first_name: "Cormac",
        last_name: "Stewart",
        phone: "+15069773663",
        cognito_sub: "cf32679c-72eb-4ff1-95bb-07562c75542c",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Evan",
        last_name: "Larkin",
        phone: "+19022130545",
        cognito_sub: "1a0c6719-9eeb-4af9-a2dc-c2bf9c97656d",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Evan",
        last_name: "Larkin",
        phone: "+15062820763",
        cognito_sub: "5c4c3eb4-8976-4b18-8611-19594a57bd81",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.sequelize.query(
      `insert into sellers(name, description, location) VALUES ("Bobs Burgers", "Fresh AAA BEEF", POINT(45.521984, -73.591234))`
    );
    await queryInterface.sequelize.query(
      `insert into sellers(name, description, location) VALUES ("Als Avo Toast", "Fresh AAA Avos", POINT(44.645823, -63.587579))`
    );
    await queryInterface.bulkInsert("dishes", [
      {
        seller_id: 1,
        name: "Spaghetti",
        Description: "Italian classic",
        price: 12.49,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("ratings", [
      {
        user_id: 1,
        seller_id: 1,
        rating: 4,
        review: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        seller_id: 2,
        rating: 5,
        review: "Amazing",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        seller_id: 2,
        rating: 3,
        review: "Just okay",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("dishes", null, {});
    await queryInterface.bulkDelete("ratings", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("sellers", null, {});
  },
};
