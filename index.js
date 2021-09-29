const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

const port = 4000;

mongoose.connect("mongodb://localhost:27017/shop");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/product", productRoute);
app.use("/order", orderRoute);

// app.get("/", (req, res) => {
//   res.send("hello");
// });
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("server has started");
});
