import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Wrench, AlertCircle, Settings, RefreshCw } from "lucide-react";

const statusStyles = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "in maintenance": "bg-amber-100 text-amber-700 border-amber-200",
  unavailable: "bg-red-100 text-red-700 border-red-200",
};

const BikeCard = ({ bike, onStatusUpdate, index }) => {
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    try {
      setError(null);
      setUpdating(true);
      const response = await fetch(
        `http://localhost:5000/api/bikes/${bike._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      await response.json();
      onStatusUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5" />;
      case "in maintenance":
        return <Wrench className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{bike.name}</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[bike.status]}`}>
              {getStatusIcon(bike.status)}
              {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
            </div>
          </div>
          <Settings className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Vendor</p>
            <p className="font-semibold text-slate-800">{bike.vendorName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Price</p>
            <p className="font-semibold text-slate-800">₹{bike.price}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Model</p>
            <p className="font-semibold text-slate-800">{bike.modelYear}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Mileage</p>
            <p className="font-semibold text-slate-800">{bike.mileage} kmpl</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">CC</p>
            <p className="font-semibold text-slate-800">{bike.cc} cc</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Quantity</p>
            <p className="font-semibold text-slate-800">{bike.quantity}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStatusUpdate("available")}
              disabled={updating || bike.status === "available"}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Available
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStatusUpdate("in maintenance")}
              disabled={updating || bike.status === "in maintenance"}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
              Maintenance
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatusUpdate("unavailable")}
            disabled={updating || bike.status === "unavailable"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
            Unavailable
          </motion.button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Maintenance = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bikes");
      const data = await response.json();
      setBikes(data);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBikes = bikes.filter(bike => {
    if (filter === "all") return true;
    return bike.status === filter;
  });

  const stats = {
    total: bikes.length,
    available: bikes.filter(b => b.status === "available").length,
    maintenance: bikes.filter(b => b.status === "in maintenance").length,
    unavailable: bikes.filter(b => b.status === "unavailable").length,
  };

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
          <p className="text-slate-600 font-medium">Loading maintenance panel...</p>
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-blue-600" />
            Maintenance Center
          </h1>
          <p className="text-slate-600 font-medium">
            Manage bike status and maintenance operations
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bikes", value: stats.total, color: "blue" },
            { label: "Available", value: stats.available, color: "emerald" },
            { label: "In Maintenance", value: stats.maintenance, color: "amber" },
            { label: "Unavailable", value: stats.unavailable, color: "red" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-4"
            >
              <p className="text-sm font-semibold text-slate-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Bikes" },
              { key: "available", label: "Available" },
              { key: "in maintenance", label: "In Maintenance" },
              { key: "unavailable", label: "Unavailable" },
            ].map((filterOption) => (
              <motion.button
                key={filterOption.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  filter === filterOption.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {filterOption.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBikes.map((bike, index) => (
              <BikeCard
                key={bike._id}
                bike={bike}
                onStatusUpdate={fetchBikes}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredBikes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No bikes found</h3>
            <p className="text-slate-500 font-medium">
              No bikes match the current filter criteria.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Maintenance;
