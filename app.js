const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { name } = require("ejs");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const OrderItem = require("./models/order-item");
const Order = require("./models/order");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      return user.getCart();
    })
    .then((cart) => {
      if (!cart) {
        return req.user.createCart();
      }
      console.log("Cart:", cart); // Log the cart
      return cart;
    })
    .then((cart) => {
      req.cart = cart;
      next();
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasOne(Cart, {
  foreignKey: "id",
  constraints: true,
});
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
User.hasOne(Cart, {
  foreignKey: "userId", // Ensures that 'userId' will be present in the 'carts' table
  onDelete: "CASCADE", // Delete the cart when the user is deleted
});

Cart.belongsTo(User, {
  foreignKey: "userId", // Links the 'userId' in 'carts' table to 'users'
});
// A user has one cart
// A cart belongs to a user

// Product.hasMany(Cart, { through: CartItem });
// Cart.hasMany(Product, { through: CartItem });
sequelize
  .sync()
  // .sync({ force: true }) // This will drop and recreate the tables
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Admin", email: "admin@example.com" });
    }
    return user;
  })
  .then((user) => {
    return user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart();
      }
      return cart;
    });
  })
  .then((cart) => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
