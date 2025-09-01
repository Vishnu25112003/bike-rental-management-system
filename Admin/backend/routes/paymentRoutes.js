const express = require("express")
const router = express.Router()
const {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
  getPaymentStatistics,
} = require("../controllers/paymentController")

// Routes
router.get("/payments", getAllPayments)
router.get("/payments/statistics", getPaymentStatistics)
router.get("/payments/:id", getPaymentById)
router.put("/payments/:id/status", updatePaymentStatus)
router.delete("/payments/:id", deletePayment)

module.exports = router
