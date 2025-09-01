import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Bike,
  Save,
  X,
  Upload,
  Eye,
  Package,
  DollarSign
} from "lucide-react";

export default function ManageBikes() {
  const [bikes, setBikes] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [bikeData, setBikeData] = useState({
    name: "",
    price: "",
    vendorName: "",
    kmLimit: "",
    extraCharge: "",
    fuel: "",
    deposit: "",
    modelYear: "",
    mileage: "",
    cc: "",
    quantity: "",
    status: "available",
    img: null,
  });
  const [editingBikeId, setEditingBikeId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/bikes")
      .then((res) => res.json())
      .then((data) => setBikes(data))
      .catch((err) => console.error("Error fetching bikes:", err));
  }, []);

  useEffect(() => {
    if (editingBikeId && activeTab === "edit") {
      const bike = bikes.find((b) => b._id === editingBikeId);
      if (bike) {
        setBikeData({
          name: bike.name || "",
          price: bike.price || "",
          vendorName: bike.vendorName || "",
          kmLimit: bike.kmLimit || "",
          extraCharge: bike.extraCharge || "",
          fuel: bike.fuel || "",
          deposit: bike.deposit || "",
          modelYear: bike.modelYear || "",
          mileage: bike.mileage || "",
          cc: bike.cc || "",
          quantity: bike.quantity || "",
          status: bike.status || "available",
          img: bike.img || null,
        });
      }
    }
  }, [editingBikeId, activeTab, bikes]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setBikeData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setBikeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    for (let key in bikeData) {
      formData.append(key, bikeData[key]);
    }

    const url = editingBikeId
      ? `http://localhost:5000/api/bikes/${editingBikeId}`
      : "http://localhost:5000/api/bikes";
    const method = editingBikeId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      const result = await res.json();

      if (res.ok) {
        if (editingBikeId) {
          setBikes(bikes.map((b) => (b._id === editingBikeId ? result.bike : b)));
        } else {
          setBikes([...bikes, result.bike]);
        }
        resetForm();
        setActiveTab("inventory");
        setMessage({
          type: "success",
          text: `✅ Bike ${editingBikeId ? "updated" : "added"} successfully!`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || `❌ Failed to ${editingBikeId ? "update" : "add"} bike.`,
        });
      }
    } catch (err) {
      console.error("Error submitting bike:", err);
      setMessage({
        type: "error",
        text: "⚠️ Something went wrong.",
      });
    } finally {
      setLoading(false);
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const resetForm = () => {
    setBikeData({
      name: "",
      price: "",
      vendorName: "",
      kmLimit: "",
      extraCharge: "",
      fuel: "",
      deposit: "",
      modelYear: "",
      mileage: "",
      cc: "",
      quantity: "",
      status: "available",
      img: null,
    });
    setEditingBikeId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bikes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBikes(bikes.filter((bike) => bike._id !== id));
        setMessage({
          type: "success",
          text: "✅ Bike deleted successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: "❌ Failed to delete bike.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "⚠️ Error deleting bike.",
      });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleEdit = (bike) => {
    setEditingBikeId(bike._id);
    setActiveTab("edit");
  };

  const getStatusStyle = (status) => {
    return status === "available"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const tabs = [
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "add", label: "Add Bike", icon: Plus },
    { id: "edit", label: "Edit Bike", icon: Edit3 },
  ];

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
            <Bike className="w-8 h-8 text-blue-600" />
            Manage Bikes
          </h1>
          <p className="text-slate-600 font-medium">
            Add, edit, and manage your bike inventory
          </p>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-6 p-4 rounded-xl border ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <p className="font-medium">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "add") resetForm();
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {bikes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bikes.map((bike, index) => (
                    <motion.div
                      key={bike._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{bike.name}</h3>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(bike.status)}`}>
                              {bike.status === "available" ? (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                              ) : (
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              )}
                              {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                            </div>
                          </div>
                          <DollarSign className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                        </div>

                        <div className="space-y-2 mb-6">
                          <p className="text-slate-600 font-medium">
                            <span className="text-2xl font-bold text-blue-600">₹{bike.price}</span>/day
                          </p>
                          <p className="text-slate-600">
                            <span className="font-semibold">{bike.cc}cc</span> • 
                            <span className="font-semibold ml-1">{bike.mileage} kmpl</span>
                          </p>
                          <p className="text-slate-500 text-sm">Vendor: {bike.vendorName}</p>
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(bike)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(bike._id)}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-2xl shadow-lg border border-slate-200"
                >
                  <Bike className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No bikes found</h3>
                  <p className="text-slate-500 font-medium mb-6">Start by adding your first bike to the inventory</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("add")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Bike
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {(activeTab === "add" || activeTab === "edit") && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {editingBikeId ? "Update Bike" : "Add New Bike"}
                </h2>
                <p className="text-slate-600 font-medium">
                  Fill in the details to {editingBikeId ? "update" : "add"} a bike
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form fields */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bike Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bikeData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Enter bike name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Price (₹/day)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={bikeData.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Enter daily price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={bikeData.vendorName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Enter vendor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      CC
                    </label>
                    <input
                      type="number"
                      name="cc"
                      value={bikeData.cc}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Engine CC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mileage (kmpl)
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={bikeData.mileage}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Fuel efficiency"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Model Year
                    </label>
                    <input
                      type="number"
                      name="modelYear"
                      value={bikeData.modelYear}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Manufacturing year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={bikeData.quantity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                      placeholder="Available quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={bikeData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    >
                      <option value="available">Available</option>
                      <option value="in maintenance">In Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bike Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500 font-medium">
                          Click to upload bike image
                        </p>
                        <input
                          type="file"
                          name="img"
                          onChange={handleChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {editingBikeId ? "Update Bike" : "Add Bike"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("inventory");
                    }}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
