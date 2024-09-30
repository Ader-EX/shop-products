const { where } = require("sequelize");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((prod) => {
      res.render("shop/product-list", {
        prods: prod,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then((item) => {
      console.log("item");
      console.log(item);
      res.render("shop/product-detail", {
        product: item[0],
        pageTitle: item[0].title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.findByPk(prodId)
  //   .then((item) => {
  //     console.log("item");
  //     console.log(item);
  //     res.render("shop/product-detail", {
  //       product: item,
  //       pageTitle: item.title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((prod) => {
      res.render("shop/index", {
        prods: prod,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        prods: products,
      });
    })
    .catch((err) => console.error(err));
};

exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((prod) => {
      let product;
      if (prod.length > 0) {
        product = prod[0];
      }

      if (product) {
        const oldQuantity = product.cartitems.qty;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { qty: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })

    .catch((err) => {
      console.error(err);
    });

  // Product.findByPk(prodId, (prod) => {
  //   Cart.addCartItem(prodId)
  //   // Cart.AddProduct(prodId, prod.price);
  // });

  // res.redirect("/cart");
};

exports.postDeleteItemFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((prod) => {
      const products = prod[0];
      return products.cartitems.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getNewOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((order) => {
      console.log(order);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: order,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        order.addProducts(
          products.map((item) => {
            item.orderItem = { qty: item.cartitems.qty };

            return item;
          })
        );
      });
    })
    .then(() => {
      fetchedCart.setProducts(null);
      return fetchedCart;
    })
    .then((newCart) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
