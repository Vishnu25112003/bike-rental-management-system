import React, { useState, useEffect } from "react";

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

  // Fetch all bikes on load
  useEffect(() => {
    fetch("http://localhost:5000/api/bikes")
      .then((res) => res.json())
      .then((data) => setBikes(data))
      .catch((err) => console.error("Error fetching bikes:", err));
  }, []);

  // Load bike data when editing
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
  }, [editingBikeId, activeTab]);

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
      setMessage({ type: "error", text: "⚠️ Something went wrong." });
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
        setMessage({ type: "success", text: "✅ Bike deleted successfully!" });
      } else {
        setMessage({ type: "error", text: "❌ Failed to delete bike." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "⚠️ Error deleting bike." });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleEdit = (bike) => {
    setEditingBikeId(bike._id);
    setActiveTab("edit");
  };

  const getStatusStyle = (status) => {
    return status === "available"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
          </svg>
          Manage Bikes
        </h1>
        <p className="text-gray-500 mt-2">Add, edit, and manage your bike inventory</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === "inventory"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === "add"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Add New Bike
          </button>
          {editingBikeId && (
            <button
              onClick={() => setActiveTab("edit")}
              className={`py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === "edit"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Edit Bike
            </button>
          )}
        </nav>
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.length > 0 ? (
            bikes.map((bike) => (
              <div key={bike._id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={bike.img}
                    alt={bike.name}
                    className="object-cover w-full h-full"
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      bike.status || "available"
                    )}`}
                  >
                    {bike.status?.charAt(0).toUpperCase() + bike.status?.slice(1)}
                  </span>
                </div>
                <div className="p-4 pb-2">
                  <h3 className="text-lg font-semibold">{bike.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{bike.price}/day • {bike.cc}cc
                  </p>
                </div>
                <div className="px-4 pb-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="text-gray-500">Vendor:</span> {bike.vendorName}</div>
                    <div><span className="text-gray-500">KM Limit:</span> {bike.kmLimit}</div>
                    <div><span className="text-gray-500">Extra/KM:</span> ₹{bike.extraCharge}</div>
                    <div><span className="text-gray-500">Fuel:</span> {bike.fuel}</div>
                    <div><span className="text-gray-500">Deposit:</span> ₹{bike.deposit}</div>
                    <div><span className="text-gray-500">Year:</span> {bike.modelYear}</div>
                    <div><span className="text-gray-500">Mileage:</span> {bike.mileage}</div>
                    <div><span className="text-gray-500">Quantity:</span> {bike.quantity}</div>
                  </div>
                </div>
                <div className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(bike)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bike._id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center py-10">No bikes found.</p>
          )}
        </div>
      )}

      {/* Add/Edit Form Tab */}
      {(activeTab === "add" || activeTab === "edit") && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              {editingBikeId ? "Edit Bike" : "Add New Bike"}
            </h3>
            <p className="text-sm text-gray-500">
              Fill in the details to {editingBikeId ? "update" : "add"} a bike
            </p>
          </div>
          <div className="p-6">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Bike Name" name="name" value={bikeData.name} onChange={handleChange} required />
                <Input label="Price (₹/day)" name="price" value={bikeData.price} onChange={handleChange} required type="number" />
                <Input label="Vendor Name" name="vendorName" value={bikeData.vendorName} onChange={handleChange} required />
                <Input label="KM Limit" name="kmLimit" value={bikeData.kmLimit} onChange={handleChange} required />
                <Input label="Extra Charge per KM (₹)" name="extraCharge" value={bikeData.extraCharge} onChange={handleChange} required />
                <SelectInput label="Fuel Included" name="fuel" value={bikeData.fuel} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </SelectInput>
                <Input label="Deposit (₹)" name="deposit" value={bikeData.deposit} onChange={handleChange} required type="number" />
                <Input label="Model Year" name="modelYear" value={bikeData.modelYear} onChange={handleChange} required />
                <Input label="Mileage (km/l)" name="mileage" value={bikeData.mileage} onChange={handleChange} required />
                <Input label="Engine Capacity (CC)" name="cc" value={bikeData.cc} onChange={handleChange} required />
                <Input label="Quantity Available" name="quantity" value={bikeData.quantity} onChange={handleChange} required type="number" />

                {/* Status Select */}
                <SelectInput label="Status" name="status" value={bikeData.status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="in maintenance">In Maintenance</option>
                </SelectInput>

                {/* Image Upload Field */}
                <div className="md:col-span-2 space-y-2">
  <label className="block text-sm font-medium text-gray-700">Bike Image</label>

  {/* Image Preview */}
  {bikeData.img && (
    typeof bikeData.img === "string" ? (
      // If it's a URL from backend
      <div className="mb-3">
        <img
          src={bikeData.img}
          alt="Preview"
          className="h-32 w-full object-cover rounded border"
        />
      </div>
    ) : (
      // If it's a new File object
      <div className="mb-3 text-sm text-gray-500">
        Selected file: {bikeData.img.name} ({(bikeData.img.size / 1024).toFixed(1)} KB)
      </div>
    )
  )}

  {/* Styled Dropzone */}
  <div className="relative">
    <input
      type="file"
      name="img"
      accept="image/*"
      onChange={handleChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      aria-label="Upload bike image"
    />

    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 mb-2 text-gray-400"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP (MAX 2MB)</p>
    </div>
  </div>
</div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("inventory");
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingBikeId ? "Save Changes" : "Add Bike"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Select Input Component
const SelectInput = ({ label, name, value, onChange, required = false, children }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      {children}
    </select>
  </div>
);