const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
      unique: true,
    },
    razorpay_payment_id: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    bikeDetails: {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      pickupDate: {
        type: Date,
        required: true,
      },
      dropoffDate: {
        type: Date,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    vendorName: {
      type: String,
      required: true,
    },
    userDetails: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    collection: "payments", // Explicitly specify collection name
  },
)

// Indexes for better query performance
paymentSchema.index({ status: 1 })
paymentSchema.index({ createdAt: -1 })
paymentSchema.index({ "userDetails.email": 1 })
paymentSchema.index({ vendorName: 1 })
paymentSchema.index({ razorpay_order_id: 1 })

module.exports = mongoose.model("Payment", paymentSchema)
