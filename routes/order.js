const { response } = require("express");
const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");

const verify = require("../verify");

router.get("/", verify, (req, res, next) => {
  Order.find()
    .select("quantity productId _id")
    .populate("productId", "name price _id")
    .exec()
    .then((result) => {
      if (result.length > 0)
        res.status(200).json({
          count: result.length,
          order: result.map((docs) => {
            return {
              quantity: docs.quantity,
              product: docs.productId,
              _id: docs._id,
              req: {
                type: "GET",
                url: `http://localhost:4000/order/${docs._id}`,
              },
            };
          }),
        });
      else if (!result)
        res.status(404).json({
          message: "order not found",
        });
      else
        res.status(404).json({
          message: "no entry found in database",
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "product was not found",
        });
      }
      const order = new Order({
        quantity: req.body.quantity,
        productId: req.body.productId,
      });
      return order.save();
    })
    .then(() => {
      res.status(201).json({
        message: "the order was created",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((result) => {
      if (!result)
        res.status(404).json({
          message: "order not found",
        });
      res.status(200).json({
        quantity: result.quantity,
        productId: result.productId,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "order deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

module.exports = router;
