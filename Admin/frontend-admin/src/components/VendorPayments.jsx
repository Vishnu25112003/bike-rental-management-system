import React, { useState } from "react";
import * as XLSX from "xlsx";

const vendorsData = [
  {
    id: 1,
    name: "Ravi Kumar",
    category: "standard",
    totalEarnings: 12000,
    commissionRate: 10,
    status: "Pending",
    paymentMode: "UPI",
    transactionId: "",
    date: "2025-05-04",
    remarks: "First cycle",
  },
  {
    id: 2,
    name: "Anjali Devi",
    category: "vip",
    totalEarnings: 48000,
    commissionRate: 8,
    status: "Paid",
    paymentMode: "Bank Transfer",
    transactionId: "TXN1034VIP",
    date: "2025-05-01",
    remarks: "Monthly payout",
  },
  // Add more dummy vendors here
];

export default function VendorPayments() {
  const [vendors, setVendors] = useState(vendorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle payment status toggle
  const toggleStatus = (id) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: v.status === "Paid" ? "Pending" : "Paid" } : v
      )
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = vendors.map((v) => ({
      Name: v.name,
      Category: v.category,
      TotalEarnings: v.totalEarnings,
      CommissionRate: v.commissionRate,
      CommissionDeducted: (v.totalEarnings * v.commissionRate) / 100,
      NetAmount: v.totalEarnings - (v.totalEarnings * v.commissionRate) / 100,
      Status: v.status,
      PaymentMode: v.paymentMode,
      TransactionID: v.transactionId,
      Date: v.date,
      Remarks: v.remarks,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VendorPayments");
    XLSX.writeFile(wb, "VendorPayments.xlsx");
  };

  // Apply filters
  const filteredVendors = vendors.filter((v) => {
    return (
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "All" || v.status === filterStatus) &&
      (filterCategory === "All" || v.category === filterCategory)
    );
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 font-poppins">
        Vendor Payments
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white"
        >
          <option value="All">All Categories</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>

      {/* No Data Found */}
      {filteredVendors.length === 0 && (
        <p className="text-center text-red-500">No data found based on the filters</p>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-700 rounded-md shadow-md bg-gray-800">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-2 border border-gray-700">Name</th>
              <th className="p-2 border border-gray-700">Category</th>
              <th className="p-2 border border-gray-700">Earnings</th>
              <th className="p-2 border border-gray-700">Commission %</th>
              <th className="p-2 border border-gray-700">Commission ₹</th>
              <th className="p-2 border border-gray-700">Net ₹</th>
              <th className="p-2 border border-gray-700">Status</th>
              <th className="p-2 border border-gray-700">Mode</th>
              <th className="p-2 border border-gray-700">Transaction ID</th>
              <th className="p-2 border border-gray-700">Date</th>
              <th className="p-2 border border-gray-700">Remarks</th>
              <th className="p-2 border border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendors.map((v) => {
              const commission = (v.totalEarnings * v.commissionRate) / 100;
              const net = v.totalEarnings - commission;
              return (
                <tr key={v.id} className="text-center border-b border-gray-700">
                  <td className="border p-2 text-gray-300">{v.name}</td>
                  <td className="border p-2 text-gray-300">{v.category}</td>
                  <td className="border p-2 text-gray-300">₹{v.totalEarnings}</td>
                  <td className="border p-2 text-gray-300">{v.commissionRate}%</td>
                  <td className="border p-2 text-gray-300">₹{commission}</td>
                  <td className="border p-2 font-semibold text-green-400">₹{net}</td>
                  <td
                    className={`border p-2 ${
                      v.status === "Paid"
                        ? "text-green-400"
                        : "text-orange-400"
                    }`}
                  >
                    {v.status}
                  </td>
                  <td className="border p-2 text-gray-300">{v.paymentMode}</td>
                  <td className="border p-2 text-gray-300">{v.transactionId}</td>
                  <td className="border p-2 text-gray-300">{v.date}</td>
                  <td className="border p-2 text-gray-300">{v.remarks}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => toggleStatus(v.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        v.status === "Paid"
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Mark {v.status === "Paid" ? "Pending" : "Paid"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
