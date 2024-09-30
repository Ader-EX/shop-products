const { where } = require("sequelize");
const Product = require("../models/product");
const db = require("../util/database");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    edit: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Product.create({
  //   title,
  //   imageUrl,
  //   price,
  //   description,
  //   id: req.user.id,
  // })
  req.user.createProduct({ title, imageUrl, price, description });
  // prod = new Product({
  //   title,
  //   imageUrl,
  //   price,
  //   description,
  //   userId: req.user.id,
  // });
  return res.redirect("/");
  // .then((res) => {
  //   console.log("Created Product");
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.productId;
  Product.findByPk(id)
    .then((prod) => {
      if (!prod) {
        return res.redirect("/");
      }
      prod.title = title;
      prod.price = price;
      prod.description = description;
      prod.imageUrl = imageUrl;

      return prod.save();
    })
    .then(() => {
      console.log("UPDATED PRODUCT");
      res.redirect("/admin/products");
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true";
  const productId = req.params.productId;
  if (!editMode) {
    console.log(editMode);
    return res.redirect("/");
  }
  req.user
    .getProducts({ where: { id: productId } })
    .then((prods) => {
      const prod = prods[0];
      if (!prod) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        edit: editMode,
        product: prod,
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((prod) => {
      res.render("admin/products", {
        prods: prod,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.fetchAll((products) => {
  //   res.render("admin/products", {
  //     prods: products,
  //     pageTitle: "Admin Products",
  //     path: "/admin/products",
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.destroy({ where: { id: productId } })
    .then((item) => {
      console.log("DELETE SUCCESSFUL");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/products");
    });

  // Product.findByPk(productId).then((prod) => {
  //   if (!prod) {
  //     return res.redirect("/");
  //   }
  //   Product.destroy({ where: { id: prod } });
  //   productId,
  //     () => {
  //       res.redirect("/admin/products");
  //     };
  // });
};
