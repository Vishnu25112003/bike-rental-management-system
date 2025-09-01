import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BikeDashboard() {
  const [loading, setLoading] = useState(true);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]); // Optional integration

  // Sample stats based on bike data
  const stats = {
    totalBikes: bikes.length,
    availableBikes: bikes.filter(b => b.status === "available").length,
    inMaintenance: bikes.filter(b => b.status === "in maintenance").length,
    unavailable: bikes.filter(b => b.status === "unavailable").length,
  };

  // Simulated recent additions (latest added bikes)
  const recentBikes = [...bikes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Maintenance alerts
  const maintenanceAlerts = bikes
    .filter(b => b.status === "in maintenance")
    .map(bike => ({
      id: bike._id,
      bike: bike.name,
      issue: "Scheduled maintenance",
      priority: "Medium",
      dueDate: new Date(bike.updatedAt).toLocaleDateString(),
    }));

  // Fetch bikes from API
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-gray-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
          Bike Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Overview of your bike inventory and maintenance status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">Total Bikes</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.totalBikes}</div>
          <p className="text-xs text-green-600">All bikes in your inventory</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">Available</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <circle cx="12" cy="12" r="9" fill="#48BB78" opacity="0.2" />
              <path d="M8 12l3 3 5-5" stroke="#48BB78" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.availableBikes}</div>
          <p className="text-xs text-green-600">Ready for booking</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">In Maintenance</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.inMaintenance}</div>
          <p className="text-xs text-yellow-600">Undergoing service</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">Unavailable</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.unavailable}</div>
          <p className="text-xs text-red-600">Currently not available</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/manage-bikes">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 mb-2"
              >
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Add New Bike</span>
            </div>
          </Link>
          <Link to="/manage-bikes?tab=inventory">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 mb-2"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm font-medium text-gray-700">View Inventory</span>
            </div>
          </Link>
          <Link to="/manage-bikes?tab=add">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 mb-2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Add New Bike</span>
            </div>
          </Link>
          
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Bikes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Bikes Added</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bike Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBikes.map((bike) => (
                  <tr key={bike._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bike.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bike.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bike.status === "available"
                            ? "bg-green-100 text-green-800"
                            : bike.status === "in maintenance"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bike.status?.charAt(0).toUpperCase() + bike.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bike.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Maintenance Alerts */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Maintenance Alerts</h2>
            </div>
            <div className="p-6 space-y-4">
              {maintenanceAlerts.length > 0 ? (
                maintenanceAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start space-x-4">
                    <div className="mt-2 w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{alert.bike}</p>
                      <p className="text-sm text-gray-500">{alert.issue}</p>
                      <div className="flex items-center mt-1">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {alert.priority}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">Due: {alert.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No active maintenance required.</p>
              )}
            </div>
          </div>

          {/* Popular Bikes (Optional placeholder) */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Popular Bikes</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500">This section can be connected to booking analytics later.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}