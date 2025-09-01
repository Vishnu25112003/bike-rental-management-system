const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userDetails: {
      name: String,
      email: String,
      phone: String,
    },
    vendorName: String,
    bikeDetails: {
      name: String,
      image: String,
      pickupDate: Date,
      dropoffDate: Date,
      quantity: Number,
    },
    amount: Number,
    currency: String,
    method: String,
    status: {
      type: String,
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "bookings" }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);