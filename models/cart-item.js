const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const CartItem = sequelize.define("cartitems", {
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
module.exports = CartItem;
