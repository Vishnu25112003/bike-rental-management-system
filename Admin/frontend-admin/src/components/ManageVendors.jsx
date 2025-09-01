import React, { useState } from "react";
import {
  FaEye,
  FaTrash,
  FaCheck,
  FaBan,
  FaFilePdf,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ManageVendors = () => {
  const [vendors, setVendors] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      image: "https://via.placeholder.com/50 ",
      status: "Pending",
      bikes: "5",
      location: "Chennai"
    },
    {
      name: "Priya Raj",
      email: "priya@example.com",
      phone: "9900887766",
      image: "https://via.placeholder.com/50 ",
      status: "Approved",
      bikes: "10",
      location: "Madurai"
    },
    {
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "9876501234",
      image: "https://via.placeholder.com/50 ",
      status: "Blocked",
      bikes: "3",
      location: "Coimbatore"
    },
    {
      name: "Sneha Nair",
      email: "sneha@example.com",
      phone: "9087654321",
      image: "https://via.placeholder.com/50 ",
      status: "Pending",
      bikes: "7",
      location: "Trichy"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleApprove = (index) => {
    const updated = [...vendors];
    updated[index].status = 'Approved';
    setVendors(updated);
    toast.success('Vendor approved');
  };

  const handleBlock = (index) => {
    const confirm = window.confirm('Are you sure you want to block this vendor?');
    if (confirm) {
      const updated = [...vendors];
      updated[index].status = 'Blocked';
      setVendors(updated);
      toast.warning('Vendor blocked');
    }
  };

  const handleDelete = (index) => {
    const updated = vendors.filter((_, i) => i !== index);
    setVendors(updated);
    toast.info('Vendor removed');
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesQuery =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter
      ? vendor.status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return matchesQuery && matchesStatus;
  });

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor List", 14, 10);
    const rows = filteredVendors.map((v) => [
      v.name,
      v.email,
      v.phone,
      v.location,
      v.bikes,
      v.status,
    ]);
    doc.autoTable({
      head: [["Name", "Email", "Phone", "Location", "Bikes", "Status"]],
      body: rows,
    });
    doc.save("vendors.pdf");
    toast.success("Exported as PDF");
  };

  const exportAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredVendors);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors.xlsx");
    toast.success("Exported as Excel");
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Manage Vendor</h1>

      {/* Search + Filter + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search vendors..."
            className="border border-gray-700 p-2 rounded bg-gray-800 text-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-700 p-2 rounded bg-gray-800 text-white"
          >
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportAsPDF}
            className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaFilePdf className="mr-2" /> PDF
          </button>
          <button
            onClick={exportAsExcel}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaFileExcel className="mr-2" /> Excel
          </button>
        </div>
      </div>

      {/* Vendor Table */}
      <div className="overflow-x-auto bg-gray-800 shadow rounded">
        <table className="min-w-full text-left text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Bikes</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2">
                  <img
                    src={vendor.image}
                    alt="Vendor"
                    className="w-12 h-12 object-cover rounded-full border border-gray-700"
                  />
                </td>
                <td className="px-4 py-2">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.email}</td>
                <td className="px-4 py-2">{vendor.phone}</td>
                <td className="px-4 py-2">{vendor.location}</td>
                <td className="px-4 py-2">{vendor.bikes}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      vendor.status === "Approved"
                        ? "bg-green-500"
                        : vendor.status === "Blocked"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleApprove(index)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleBlock(index)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <FaBan />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md relative text-white">
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-2 right-3 text-red-400 hover:text-red-300"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">
              Vendor Details
            </h2>
            <img
              src={selectedVendor.image}
              alt="Vendor"
              className="w-24 h-24 rounded-full border mx-auto mb-4"
            />
            <p><strong>Name:</strong> {selectedVendor.name}</p>
            <p><strong>Email:</strong> {selectedVendor.email}</p>
            <p><strong>Phone:</strong> {selectedVendor.phone}</p>
            <p><strong>Location:</strong> {selectedVendor.location}</p>
            <p><strong>Bikes:</strong> {selectedVendor.bikes}</p>
            <p><strong>Status:</strong> {selectedVendor.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;