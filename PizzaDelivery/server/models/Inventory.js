const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Base",
        "Sauce",
        "Cheese",
        "Vegetable",
      ],
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 20,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model(
  "Inventory",
  inventorySchema
);

module.exports = Inventory;