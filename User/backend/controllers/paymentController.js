// controllers/paymentController.js
const Razorpay = require("razorpay")
const crypto = require("crypto")
const Payment = require("../models/paymentModel")

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
})

// Create Order
// controllers/paymentController.js

exports.createOrder = async (req, res) => {
  const { method, amount, bikeDetails, userDetails, isDemo = false, vendorName } = req.body
  try {
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

    let razorpayOrderId = orderId

    if (!isDemo) {
      const options = {
        amount: (amount || 1500) * 100,
        currency: "INR",
        receipt: `receipt_${Math.floor(Math.random() * 1000000)}`,
      }

      const order = await instance.orders.create(options)
      razorpayOrderId = order.id
    }

    const payment = new Payment({
      razorpay_order_id: razorpayOrderId,
      method,
      amount: amount || 1500,
      bikeDetails: bikeDetails || {},
      userDetails: userDetails || {},
      vendorName: vendorName || "", // ✅ Save actual vendor name
      isDemo,
    })

    await payment.save()

    res.json({
      orderId: razorpayOrderId,
      isDemo,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    res.status(500).json({ error: "Error creating order" })
  }
}
// Verify Payment
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo = false } = req.body

  try {
    // For demo payments, skip signature verification
    if (isDemo) {
      // Generate a fake payment ID if not provided
      const demoPaymentId = razorpay_payment_id || `pay_demo_${Date.now()}`
      const demoSignature = "demo_signature"

      // Update payment record for demo payment
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id: demoPaymentId,
          razorpay_signature: demoSignature,
          status: "paid",
        },
      )

      return res.json({
        success: true,
        message: "Demo payment successful",
        paymentId: demoPaymentId,
      })
    }

    // For real payments, verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
    const generatedSignature = hmac.digest("hex")

    if (generatedSignature === razorpay_signature) {
      // Update payment record
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          status: "paid",
        },
      )

      return res.json({ success: true })
    }

    return res.status(400).json({ success: false })
  } catch (error) {
    console.error("Payment verification error:", error)
    return res.status(500).json({ success: false, error: "Payment verification failed" })
  }
}

// Process Demo Payment
exports.processDemoPayment = async (req, res) => {
  const { orderId, userDetails, bikeDetails, vendorName } = req.body
  try {
    const demoPaymentId = `pay_demo_${Date.now()}`

    await Payment.findOneAndUpdate(
      { razorpay_order_id: orderId },
      {
        razorpay_payment_id: demoPaymentId,
        status: "paid",
        userDetails: userDetails || {},
        bikeDetails: bikeDetails || {},
        vendorName: vendorName || "", // ✅ Save actual vendor name
      },
    )

    return res.json({
      success: true,
      message: "Demo payment processed successfully",
      paymentId: demoPaymentId,
    })
  } catch (error) {
    console.error("Demo payment error:", error)
    return res.status(500).json({ success: false, error: "Demo payment processing failed" })
  }
}

// Get Payment Details
exports.getPaymentDetails = async (req, res) => {
  const { orderId } = req.params

  try {
    const payment = await Payment.findOne({ razorpay_order_id: orderId })

    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" })
    }

    return res.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Get payment details error:", error)
    return res.status(500).json({ success: false, error: "Failed to get payment details" })
  }
}
