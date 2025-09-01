"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Download,
  FileText,
  Filter,
  Calendar,
  User,
  CreditCard,
  Package,
  MapPin,
  Clock,
  Phone,
  Mail,
  IndianRupee,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react"

const ManageBooking = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter, dateFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/payments")
      const data = await response.json()
      if (data.success) {
        setBookings(data.payments || [])
      } else {
        setError(data.message || "Failed to fetch bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.userDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bikeDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }
    if (dateFilter) {
      filtered = filtered.filter(
        (booking) => new Date(booking.createdAt).toDateString() === new Date(dateFilter).toDateString(),
      )
    }
    setFilteredBookings(filtered)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateFilter("")
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Order ID", "Payment ID", "User", "Vendor", "Bike", "Amount", "Status", "Date"].join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.razorpay_order_id || "N/A",
          booking.razorpay_payment_id || "N/A",
          booking.userDetails?.name || "N/A",
          booking.vendorName || "N/A",
          booking.bikeDetails?.name || "N/A",
          booking.amount || 0,
          booking.status || "N/A",
          new Date(booking.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "failed":
        return "bg-red-500 text-white"
      case "cancelled":
        return "bg-gray-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount, currency = "INR") => {
    if (!amount) return "₹0"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await response.json()
      if (data.success) {
        fetchBookings() // Refresh the data
      } else {
        alert("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error updating status")
    }
  }

  return (
    <>
      <style jsx global>{`
        /* Dark theme styles for admin panel */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #0f172a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
            "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .App {
          min-height: 100vh;
          background-color: #0f172a;
        }

        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* Input focus styles */
        input:focus,
        select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.5);
        }

        /* Button hover animations */
        button {
          transition: all 0.2s ease-in-out;
        }

        button:hover {
          transform: translateY(-1px);
        }

        /* Card hover effects */
        .bg-slate-800:hover {
          background-color: #334155;
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>

      <div className="min-h-screen bg-slate-900 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-orange-500">Manage Bookings</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Total: {filteredBookings.length}</span>
            <button onClick={fetchBookings} className="p-2 hover:bg-slate-800 rounded">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by user or vendor"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-slate-400"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                />
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 text-white"
              >
                <Filter className="h-4 w-4" />
                Reset Filters
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
            <div className="p-12 text-center">
              <p className="text-slate-400 text-lg">No bookings found.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Payment Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-400" />
                        <h3 className="font-semibold text-sm text-blue-400">Payment Details</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-xs">Order ID:</span>
                          <span className="font-mono text-xs text-white break-all">
                            {booking.razorpay_order_id || "N/A"}
                          </span>
                        </div>
                        {booking.razorpay_payment_id && (
                          <div className="flex flex-col">
                            <span className="text-slate-400 text-xs">Payment ID:</span>
                            <span className="font-mono text-xs text-white break-all">{booking.razorpay_payment_id}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Amount:</span>
                          <span className="font-semibold flex items-center text-green-400">
                            <IndianRupee className="h-3 w-3" />
                            {booking.amount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Currency:</span>
                          <span className="text-white">{booking.currency || "INR"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Method:</span>
                          <span className="text-white">{booking.method || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Status:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status || "unknown"}
                          </span>
                        </div>
                        {booking.isDemo && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium border border-orange-500 text-orange-400 bg-orange-900/20">
                            Demo Payment
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Bike Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-400" />
                        <h3 className="font-semibold text-sm text-green-400">Bike Details</h3>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                          {booking.bikeDetails?.image ? (
                            <img
                              src={booking.bikeDetails.image || "/placeholder.svg"}
                              alt={booking.bikeDetails?.name || "Bike"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <span className="text-slate-300 font-medium">
                            {booking.bikeDetails?.name?.charAt(0) || "B"}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-white">{booking.bikeDetails?.name || "N/A"}</p>
                          <p className="text-slate-400">Quantity: {booking.bikeDetails?.quantity || 1}</p>
                          {booking.bikeDetails?.pickupDate && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <MapPin className="h-3 w-3" />
                              <span className="text-xs">Pickup: {formatDate(booking.bikeDetails.pickupDate)}</span>
                            </div>
                          )}
                          {booking.bikeDetails?.dropoffDate && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">Dropoff: {formatDate(booking.bikeDetails.dropoffDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Customer Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-400" />
                        <h3 className="font-semibold text-sm text-purple-400">Customer Details</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-white">{booking.userDetails?.name || "N/A"}</p>
                        {booking.userDetails?.email && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs break-all">{booking.userDetails.email}</span>
                          </div>
                        )}
                        {booking.userDetails?.phone && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{booking.userDetails.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Booking Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-400" />
                        <h3 className="font-semibold text-sm text-orange-400">Booking Info</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400 text-xs">Vendor:</span>
                          <p className="font-medium text-white">{booking.vendorName || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Booked on:</span>
                          <p className="text-xs text-white">{formatDate(booking.createdAt)}</p>
                        </div>
                        {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                          <div>
                            <span className="text-slate-400 text-xs">Last updated:</span>
                            <p className="text-xs text-white">{formatDate(booking.updatedAt)}</p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                          <div className="relative group">
                            <button className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-600 text-white rounded hover:bg-slate-500">
                              <Edit className="h-3 w-3" />
                              Edit
                            </button>
                            <div className="absolute top-full left-0 mt-1 bg-slate-700 border border-slate-600 rounded shadow-lg hidden group-hover:block z-10">
                              <button
                                onClick={() => updatePaymentStatus(booking._id, "paid")}
                                className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-slate-600"
                              >
                                Mark as Paid
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(booking._id, "pending")}
                                className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-slate-600"
                              >
                                Mark as Pending
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(booking._id, "failed")}
                                className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-slate-600"
                              >
                                Mark as Failed
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(booking._id, "cancelled")}
                                className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-slate-600"
                              >
                                Mark as Cancelled
                              </button>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ManageBooking