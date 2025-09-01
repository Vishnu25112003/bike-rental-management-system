// routes/paymentRoutes.js
const express = require("express")
const router = express.Router()
const paymentController = require("../controllers/paymentController")

router.post("/create-order", paymentController.createOrder)
router.post("/verify-payment", paymentController.verifyPayment)
router.post("/process-demo-payment", paymentController.processDemoPayment)
router.get("/payment-details/:orderId", paymentController.getPaymentDetails)

module.exports = router
