const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Product", productSchema);
