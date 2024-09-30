const Sequelize = require("sequelize");

const sequelize = new Sequelize("productmaker", "root", "nakanonino", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "productmaker",
//   password: "nakanonino",
// });

// module.exports = pool.promise();
