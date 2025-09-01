const Payment = require("../models/paymentModel")

// Get all payments with filtering and pagination
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, vendor, user, startDate, endDate, search } = req.query

    // Build filter object
    const filter = {}

    if (status && status !== "all") {
      filter.status = status
    }

    if (vendor) {
      filter.vendorName = { $regex: vendor, $options: "i" }
    }

    if (user) {
      filter["userDetails.name"] = { $regex: user, $options: "i" }
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    if (search) {
      filter.$or = [
        { "userDetails.name": { $regex: search, $options: "i" } },
        { "userDetails.email": { $regex: search, $options: "i" } },
        { vendorName: { $regex: search, $options: "i" } },
        { "bikeDetails.name": { $regex: search, $options: "i" } },
        { razorpay_order_id: { $regex: search, $options: "i" } },
        { razorpay_payment_id: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get payments with pagination and ensure all fields are included
    const payments = await Payment.find(filter)
      .select({
        _id: 1,
        razorpay_order_id: 1,
        razorpay_payment_id: 1,
        amount: 1,
        currency: 1,
        method: 1,
        status: 1,
        isDemo: 1,
        bikeDetails: 1,
        vendorName: 1,
        userDetails: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const totalPayments = await Payment.countDocuments(filter)
    const totalPages = Math.ceil(totalPayments / limit)

    // Calculate statistics
    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalPayments: { $sum: 1 },
          paidPayments: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          cancelledPayments: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ])

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalPayments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      statistics: stats[0] || {
        totalAmount: 0,
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        cancelledPayments: 0,
      },
    })
  } catch (error) {
    console.error("Error fetching payments:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    })
  }
}

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findById(id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Error fetching payment:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    })
  }
}

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, razorpay_payment_id } = req.body

    const validStatuses = ["pending", "paid", "failed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Valid statuses are: " + validStatuses.join(", "),
      })
    }

    const updateData = { status }
    if (razorpay_payment_id) {
      updateData.razorpay_payment_id = razorpay_payment_id
    }

    const payment = await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${status} successfully`,
      payment,
    })
  } catch (error) {
    console.error("Error updating payment:", error)
    res.status(500).json({
      success: false,
      message: "Error updating payment",
      error: error.message,
    })
  }
}

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findByIdAndDelete(id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting payment:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting payment",
      error: error.message,
    })
  }
}

// Get payment statistics
const getPaymentStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const matchStage = {}
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const stats = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          paidPayments: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          cancelledPayments: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          averagePaymentValue: { $avg: "$amount" },
        },
      },
    ])

    // Get top vendors
    const topVendors = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$vendorName",
          paymentCount: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { paymentCount: -1 } },
      { $limit: 5 },
    ])

    // Get monthly trends
    const monthlyTrends = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          paymentCount: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    res.status(200).json({
      success: true,
      statistics: stats[0] || {
        totalPayments: 0,
        totalRevenue: 0,
        paidPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        cancelledPayments: 0,
        averagePaymentValue: 0,
      },
      topVendors,
      monthlyTrends,
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    })
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
  getPaymentStatistics,
}
