import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  CheckCircle,
  Wrench,
  XCircle,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Eye
} from "lucide-react";

export default function BikeDashboard() {
  const [loading, setLoading] = useState(true);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);

  const stats = {
    totalBikes: bikes.length,
    availableBikes: bikes.filter(b => b.status === "available").length,
    inMaintenance: bikes.filter(b => b.status === "in maintenance").length,
    unavailable: bikes.filter(b => b.status === "unavailable").length,
  };

  const recentBikes = [...bikes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const maintenanceAlerts = bikes
    .filter(b => b.status === "in maintenance")
    .map(bike => ({
      id: bike._id,
      bike: bike.name,
      issue: "Scheduled maintenance",
      priority: "Medium",
      dueDate: new Date(bike.updatedAt).toLocaleDateString(),
    }));

  useEffect(() => {
    fetch("http://localhost:5000/api/bikes")
      .then(res => res.json())
      .then(data => {
        setBikes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bikes:", err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: "Total Bikes",
      value: stats.totalBikes,
      description: "All bikes in your inventory",
      icon: Bike,
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Available",
      value: stats.availableBikes,
      description: "Ready for booking",
      icon: CheckCircle,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "In Maintenance",
      value: stats.inMaintenance,
      description: "Undergoing service",
      icon: Wrench,
      color: "amber",
      gradient: "from-amber-500 to-amber-600"
    },
    {
      title: "Unavailable",
      value: stats.unavailable,
      description: "Currently not available",
      icon: XCircle,
      color: "red",
      gradient: "from-red-500 to-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-inter">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="p-6 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600 font-medium">
            Overview of your bike inventory and maintenance status
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bikes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                Recent Bikes
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Bike Name</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Vendor</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Status</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentBikes.map((bike, index) => (
                      <motion.tr
                        key={bike._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-800">{bike.name}</td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{bike.vendorName}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            bike.status === 'available' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : bike.status === 'in maintenance'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bike.status?.charAt(0).toUpperCase() + bike.status?.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium">{bike.quantity}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Maintenance Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                Maintenance Alerts
              </h2>
            </div>
            <div className="p-6">
              {maintenanceAlerts.length > 0 ? (
                <div className="space-y-4">
                  {maintenanceAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                    >
                      <h4 className="font-semibold text-amber-800 mb-1">{alert.bike}</h4>
                      <p className="text-amber-700 text-sm font-medium mb-2">{alert.issue}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-600 font-medium">Due: {alert.dueDate}</span>
                        <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-medium">
                          {alert.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No active maintenance required.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard/manage-bikes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Bike className="w-5 h-5" />
              Manage Bikes
            </Link>
            <Link
              to="/dashboard/bookings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200"
            >
              <Eye className="w-5 h-5" />
              View Bookings
            </Link>
            <Link
              to="/dashboard/maintenance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors duration-200"
            >
              <Wrench className="w-5 h-5" />
              Maintenance
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
