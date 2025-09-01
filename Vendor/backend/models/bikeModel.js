const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    kmLimit: {
      type: String,
      required: true,
    },
    extraCharge: {
      type: String,
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    modelYear: {
      type: String,
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    cc: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "in maintenance", "unavailable"],
      default: "available",
    },
    // Optional fields for better management
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // Automatically adds and updates `createdAt` and `updatedAt`
  }
);

module.exports = mongoose.model("Bike", bikeSchema);