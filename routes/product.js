const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name description price _id")
    .exec()
    .then((result) => {
      if (result.length > 0)
        res.status(200).json({
          count: result.length,
          product: result.map((docs) => {
            return {
              name: docs.name,
              description: docs.description,
              price: docs.price,
              _id: docs._id,
              productImage: docs.productImage,
              req: {
                type: "GET",
                url: `http://localhost:4000/product/${docs._id}`,
              },
            };
          }),
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

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    productImage: req.file.path,
  });
  product.save((err) => {
    if (err) {
      res.status(500).json({
        error: {
          message: err,
        },
      });
    } else {
      res.status(201).json({
        message: "update product",
        product: product,
      });
    }
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

router.put("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "updated product",
  });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove(id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({
        message: "product deleted",
      });
    }
  });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  console.log(updateOps);
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(() => {
      res.status(200).json({ message: "data updated" });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
module.exports = router;
//nodemon
//morgan
