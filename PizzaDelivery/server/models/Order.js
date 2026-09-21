const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  },

    size: {
      type: String,
      required: true,
    },

    base: {
      type: String,
      required: true,
    },

    sauce: {
      type: String,
      required: true,
    },

    cheese: {
      type: String,
      required: true,
    },

    toppings: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "Order Received",
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    inventoryDeducted: {
      type: Boolean,
     default: false,
    },

    razorpayOrderId: {
      type: String,
     default: null,
  },

  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;