import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSort } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

const safetyOrange = "#FF6700";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/signup");
        setUsers(res.data.map((u, i) => ({
          id: i + 1,
          _id: u._id,
          name: u.username,
          email: u.email || "N/A",
          phone: u.mobile,
          status: u.status || "Active",
          profilePicture: u.profilePicture || "",
        })));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    const newStatus = user.status === "Active" ? "Blocked" : "Active";

    try {
      await axios.put(`http://localhost:5000/api/signup/${user._id}/status`, { status: newStatus });
      setUsers(users.map((u) => u.id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleEditUser = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/signup/${selectedUser._id}`, {
        username: selectedUser.name,
        phone: selectedUser.phone,
        status: selectedUser.status,
      });
      setUsers(users.map(u => u._id === res.data._id ? {
        ...u,
        name: res.data.username,
        phone: res.data.mobile,
        status: res.data.status
      } : u));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    const user = users.find((u) => u.id === id);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/signup/${user._id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleExportCSV = () => {
    const csvData = users.map(({ id, name, email, phone, status }) => ({ id, name, email, phone, status }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["ID", "Name", "Email", "Phone", "Status"]],
      body: users.map((user) => [user.id, user.name, user.email, user.phone, user.status]),
    });
    doc.save("users.pdf");
  };

  const getFilteredSortedUsers = () => {
    let filtered = [...users];
    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus) filtered = filtered.filter(u => u.status === filterStatus);
    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField]?.toString().toLowerCase();
        const bVal = b[sortField]?.toString().toLowerCase();
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return filtered;
  };

  const totalPages = Math.ceil(getFilteredSortedUsers().length / usersPerPage);
  const currentUsers = getFilteredSortedUsers().slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: safetyOrange }}>Manage Users</h1>

        {/* Controls */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 gap-3">
          <div className="flex flex-1 gap-2">
            <input type="text" placeholder="Search by name/email..." value={searchQuery} onChange={handleSearch} className="flex-grow p-2 rounded bg-gray-800 text-white placeholder-gray-400" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 rounded bg-gray-800 text-white">
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleExportCSV} className="bg-green-600 px-4 py-2 rounded">Export CSV</button>
            <button onClick={handleExportPDF} className="bg-orange-600 px-4 py-2 rounded">Export PDF</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full table-auto bg-gray-800 text-left text-sm">
            <thead>
              <tr className="text-gray-300">
                {["ID", "Name", "Email", "Phone", "Status"].map((heading, idx) => (
                  <th key={idx} onClick={() => handleSort(heading.toLowerCase())} className="py-3 px-4 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1">{heading} <FaSort className="text-xs" /></div>
                  </th>
                ))}
                <th className="py-3 px-4">Profile</th>
                <th className="py-3 px-4">Toggle</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.phone}</td>
                  <td className="py-2 px-4">{user.status}</td>
                  <td className="py-2 px-4">{user.profilePicture ? <img src={user.profilePicture} alt="avatar" className="w-8 h-8 rounded-full" /> : "N/A"}</td>
                  <td className="py-2 px-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={user.status === "Active"} onChange={() => toggleStatus(user.id)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:left-1 after:top-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:left-6" />
                    </label>
                  </td>
                  <td className="py-2 px-4 space-x-1">
                    <button onClick={() => { setSelectedUser(user); setShowViewModal(true); }} className="bg-blue-500 px-3 py-1 rounded">View</button>
                    <button onClick={() => { setSelectedUser(user); setShowEditModal(true); }} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} className="bg-gray-600 px-4 py-2 rounded">Prev</button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} className="bg-gray-600 px-4 py-2 rounded">Next</button>
        </div>

        {/* View Modal */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">User Details</h2>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              {selectedUser.profilePicture && <img src={selectedUser.profilePicture} alt="avatar" className="w-20 h-20 rounded-full my-3" />}
              <button onClick={() => setShowViewModal(false)} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Close</button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <input className="w-full p-2 mb-2 border" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
              <input className="w-full p-2 mb-2 border" value={selectedUser.phone} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
              <select className="w-full p-2 mb-2 border" value={selectedUser.status} onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              <button onClick={handleEditUser} className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
              <button onClick={() => setShowEditModal(false)} className="ml-2 bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
