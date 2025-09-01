// models/paymentModel.js
const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  amount: { type: Number, default: 1500 },
  currency: { type: String, default: "INR" },
  method: {
    type: String,
    enum: ["Google Pay", "PhonePe", "Paytm", "Net Banking", "Credit/Debit Card", "Demo Payment"],
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  isDemo: { type: Boolean, default: false },
  bikeDetails: {
    type: Object,
    default: {},
  },
  userDetails: {
    type: Object,
    default: {},
  },
  vendorName: { // <-- NEW FIELD
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Payment", PaymentSchema)