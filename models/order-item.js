const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Order = require("./order");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  qty: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});
module.exports = OrderItem;
