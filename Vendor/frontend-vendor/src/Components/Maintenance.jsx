import React, { useState, useEffect } from "react";
import { CheckCircle, Wrench, AlertCircle } from "lucide-react";

const statusStyles = {
  available: "bg-green-100 text-green-700",
  "in maintenance": "bg-yellow-100 text-yellow-700",
  unavailable: "bg-red-100 text-red-700",
};

const BikeCard = ({ bike, onStatusUpdate }) => {
  const [error, setError] = useState(null);

  const handleStatusUpdate = async (status) => {
    try {
      setError(null);
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
      onStatusUpdate(); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  return (
    <div className="border border-gray-200 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition duration-300 flex flex-col">
      <img
        src={bike.img}
        alt={bike.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{bike.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            statusStyles[bike.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {bike.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Vendor:</strong> {bike.vendorName}</p>
        <p><strong>Price:</strong> ₹{bike.price}</p>
        <p><strong>Model:</strong> {bike.modelYear}</p>
        <p><strong>Mileage:</strong> {bike.mileage} kmpl</p>
        <p><strong>CC:</strong> {bike.cc} cc</p>
        <p><strong>Quantity:</strong> {bike.quantity}</p>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleStatusUpdate("available")}
          className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm transition ${
            bike.status === "available"
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          disabled={bike.status === "available"}
        >
          <CheckCircle size={16} />
          Available
        </button>

        <button
          onClick={() => handleStatusUpdate("in maintenance")}
          className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm transition ${
            bike.status === "in maintenance"
              ? "bg-yellow-500 text-white cursor-not-allowed"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
          }`}
          disabled={bike.status === "in maintenance"}
        >
          <Wrench size={16} />
          Maintenance
        </button>
      </div>
    </div>
  );
};

const BikeManagement = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/bikes");
      if (!response.ok) {
        throw new Error("Failed to fetch bikes");
      }
      const data = await response.json();
      setBikes(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching bikes:", error);
      setError("Failed to load bikes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Bike Management
      </h1>

      {loading && <div className="text-center">Loading bikes...</div>}

      {error && (
        <div className="flex justify-center items-center gap-2 text-red-600 text-center mb-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bikes.map((bike) => (
          <BikeCard key={bike._id} bike={bike} onStatusUpdate={fetchBikes} />
        ))}
      </div>

      {bikes.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 mt-6">
          No bikes available.
        </div>
      )}
    </div>
  );
};

export default BikeManagement;
