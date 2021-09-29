const mongoose = require("mongoose");
const { Schema } = mongoose;
const orderSchema = new Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
module.exports = mongoose.model("Order", orderSchema);
