"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalAmount, rentalAmount, depositAmount, bikeDetails, userDetails } =
    location.state || {}

  const [selectedMethod, setSelectedMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDemoOption, setShowDemoOption] = useState(true)

  // State for showing order details modal
  const [showModal, setShowModal] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js "
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!selectedMethod) {
      Swal.fire({
        icon: "warning",
        title: "Payment Method Required",
        text: "Please select a payment method to continue.",
      })
      return
    }

    setIsProcessing(true)

    try {
      const isDemo = selectedMethod === "Demo Payment"

      const response = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount || 1500,
          method: selectedMethod,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          bikeDetails: bikeDetails || {},
          userDetails: userDetails || {},
          vendorName: bikeDetails?.vendorName || "Mathan Rental Service",
          isDemo,
        }),
      })

      if (!response.ok) throw new Error("Failed to create order")

      const data = await response.json()

      if (isDemo) {
        await processDemoPayment(data.orderId)
      } else {
        openRazorpay(data.orderId)
      }
    } catch (error) {
      console.error("Payment error:", error)
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "There was an error processing your payment. Please try again.",
      })
      setIsProcessing(false)
    }
  }

  const processDemoPayment = async (orderId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/process-demo-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            userDetails: userDetails || {
              name: "Demo User",
              email: "demo@example.com",
              phone: "9999999999",
            },
            bikeDetails: bikeDetails || { name: "Demo Bike Rental" },
            vendorName: bikeDetails?.vendorName || "Mathan Rental Service",
          }),
        }
      )

      if (!response.ok) throw new Error("Failed to process demo payment")

      const result = await response.json()

      if (result.success) {
        showOrderModal({
          bikeName: bikeDetails.name,
          vendorName: bikeDetails.vendorName || "Unknown Vendor",
          pickupDate: bikeDetails.pickupDate,
          dropoffDate: bikeDetails.dropoffDate,
          amount: totalAmount || 1500,
          paymentId: result.paymentId || "N/A",
          paymentMethod: "Demo Payment",
          rentalAmount,
          depositAmount,
        })
      } else {
        throw new Error("Demo payment failed")
      }
    } catch (error) {
      console.error("Demo payment error:", error)
      Swal.fire({
        icon: "error",
        title: "Demo Payment Failed",
        text: "There was an error processing your demo payment.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const openRazorpay = (orderId) => {
    const options = {
      key: "rzp_test_1aVErRURGmjREi",
      amount: (totalAmount || 1500) * 100,
      currency: "INR",
      name: "Bike Rental Service",
      description: `Booking for ${bikeDetails?.name || "Bike Rental"}`,
      order_id: orderId,
      handler: async (res) => {
        try {
          const verifyRes = await fetch(
            "http://localhost:5000/api/payments/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              }),
            }
          )

          const result = await verifyRes.json()

          if (result.success) {
            showOrderModal({
              bikeName: bikeDetails.name,
              vendorName: bikeDetails.vendorName || "Unknown Vendor",
              pickupDate: bikeDetails.pickupDate,
              dropoffDate: bikeDetails.dropoffDate,
              amount: totalAmount || 1500,
              paymentId: res.razorpay_payment_id,
              paymentMethod: selectedMethod,
              rentalAmount,
              depositAmount,
            })
          } else {
            throw new Error("Verification failed")
          }
        } catch (error) {
          console.error("Verification error:", error)
          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text: "We could not verify your payment. Please contact support.",
          })
        } finally {
          setIsProcessing(false)
        }
      },
      prefill: {
        name: userDetails?.name || "User Name",
        email: userDetails?.email || "user@example.com",
        contact: userDetails?.phone || "9999999999",
      },
      theme: {
        color: "#F97316",
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)

    rzp.on("payment.failed", (response) => {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text:
          response.error.description ||
          "Your payment has failed. Please try again.",
      })
      setIsProcessing(false)
    })

    rzp.open()
  }

  const showOrderModal = (data) => {
    setBookingData(data)
    setShowModal(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setShowModal(false)
    document.body.style.overflow = "auto"
  }

  const methods = [
    { name: "Google Pay", icon: "fas fa-mobile-alt", color: "text-red-600" },
    { name: "PhonePe", icon: "fas fa-mobile-alt", color: "text-indigo-600" },
    { name: "Paytm", icon: "fas fa-wallet", color: "text-blue-500" },
    { name: "Net Banking", icon: "fas fa-university", color: "text-green-600" },
    {
      name: "Credit/Debit Card",
      icon: "fas fa-credit-card",
      color: "text-orange-600",
    },
  ]

  const demoMethod = {
    name: "Demo Payment",
    icon: "fas fa-vial",
    color: "text-purple-600",
  }

  return (
    <>
      {/* Your existing UI */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
        >
          {/* Existing form content */}

          <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
            Payment Details
          </h2>

          {/* Booking Summary */}
          {totalAmount && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
              {bikeDetails && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                  {bikeDetails.image && (
                    <img
                      src={bikeDetails.image || "/placeholder.svg"}
                      alt={bikeDetails.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{bikeDetails.name}</p>
                    <p className="text-xs text-gray-500">
                      {bikeDetails.quantity}{" "}
                      {bikeDetails.quantity > 1 ? "bikes" : "bike"} •{" "}
                      {new Date(bikeDetails.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Rental Amount:</span>
                  <span>₹{rentalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Amount:</span>
                  <span>₹{depositAmount}</span>
                </div>
                <div className="flex justify-between font-semibold text-orange-600 border-t border-gray-200 pt-1 mt-1">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Demo Mode Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Demo Mode</span>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={showDemoOption}
                onChange={() => setShowDemoOption(!showDemoOption)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-8">
            {showDemoOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedMethod(demoMethod.name)
                }}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  selectedMethod === demoMethod.name
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-300"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`${demoMethod.icon} text-xl ${demoMethod.color}`}></i>
                  <div>
                    <span className="text-black font-medium">{demoMethod.name}</span>
                    <p className="text-xs text-gray-500">
                      Test payment without real transaction
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === demoMethod.name
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-400"
                  } flex items-center justify-center`}
                >
                  {selectedMethod === demoMethod.name && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </motion.div>
            )}

            {methods.map((method) => (
              <motion.div
                key={method.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(method.name)}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  selectedMethod === method.name
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-300"
                    : "border-gray-300 hover:border-orange-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`${method.icon} text-xl ${method.color}`}></i>
                  <span className="text-black font-medium">{method.name}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === method.name
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-400"
                  } flex items-center justify-center`}
                >
                  {selectedMethod === method.name && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isProcessing
                ? "bg-gray-400 text-white cursor-not-allowed"
                : selectedMethod === "Demo Payment"
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : selectedMethod === "Demo Payment" ? (
              `Complete Demo Payment (₹${totalAmount || 1500})`
            ) : (
              `Pay ₹${totalAmount || 1500}`
            )}
          </motion.button>

          <div className="mt-4 text-xs text-center text-gray-500">
            {selectedMethod === "Demo Payment" ? (
              <p>This is a demo payment. No actual payment gateway will be used.</p>
            ) : (
              <>
                <p>This is a test payment. No actual charges will be made.</p>
                <p className="mt-1">Powered by Razorpay Test Mode</p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modern Scrollable Order Confirmed Modal */}
      {showModal && bookingData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform-gpu"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-box-open"></i> Your Order Confirmed
              </h3>
            </div>

            {/* Scrollable Body */}
            <div className="max-h-96 overflow-y-auto p-6 space-y-4">
              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-motorcycle text-orange-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">{bookingData.bikeName}</p>
                  <p className="text-xs text-gray-500">Model: {bikeDetails?.model || "Standard"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-building text-purple-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Vendor</p>
                  <p className="text-sm">{bookingData.vendorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-calendar-check text-blue-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Pickup Date</p>
                  <p className="text-sm">
                    {new Date(bookingData.pickupDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-calendar-times text-red-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Return Date</p>
                  <p className="text-sm">
                    {new Date(bookingData.dropoffDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-money-bill-wave text-yellow-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-sm">₹{bookingData.amount}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-coins text-pink-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Rental + Deposit Breakdown</p>
                  <p className="text-sm">
                    ₹{bookingData.rentalAmount} (Rental) + ₹{bookingData.depositAmount} (Deposit)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b pb-3">
                <i className="fas fa-receipt text-teal-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm">{bookingData.paymentMethod}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-qrcode text-indigo-500 text-lg mt-1"></i>
                <div>
                  <p className="font-medium">Payment ID</p>
                  <p className="text-sm truncate max-w-[250px] font-mono">
                    {bookingData.paymentId}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default Payment