function applyExtraSetup(sequelize) {
  const { seller, user, ratings, dishes } = sequelize.models;
  ratings.hasOne(seller, { foreignKey: "id" });
  ratings.hasOne(user, { foreignKey: "id" });
  dishes.hasOne(seller, { foreignKey: "id" });
}

module.exports = { applyExtraSetup };
