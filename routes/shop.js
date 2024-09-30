const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postAddToCart);

router.post("/delete-item-cart", shopController.postDeleteItemFromCart);

router.get("/orders", shopController.postAddToCart);

router.get("/checkout", shopController.getCheckout);

router.get("/orders", shopController.getNewOrders);

router.post("/create-order", shopController.postOrder);

module.exports = router;
