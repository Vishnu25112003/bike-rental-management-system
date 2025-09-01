import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import '../index.css';

// Reusable Summary Card
const Card = ({ title, value, onClick, borderColor = 'border-orange-500' }) => (
  <div
    onClick={onClick}
    className={`bg-gray-800 p-6 rounded-lg shadow border-l-4 ${borderColor} cursor-pointer hover:bg-gray-700 transition duration-300`}
  >
    <h4 className="text-lg font-semibold text-gray-200 font-poppins">{title}</h4>
    <p className="text-2xl mt-2 text-orange-400 font-poppins">{value}</p>
  </div>
);

// Booking Status Badge
const StatusBadge = ({ status }) => {
  const colors = {
    Completed: 'bg-green-600',
    Ongoing: 'bg-blue-600',
    Cancelled: 'bg-red-600',
  };
  return (
    <span
      className={`px-2 py-1 text-white text-xs rounded ${
        colors[status] || 'bg-gray-500'
      } font-poppins`}
    >
      {status}
    </span>
  );
};

const AdminHome = () => {
  const navigate = useNavigate();

  // Sample Data
  const vendors = [
    { id: 1, name: 'Vendor A', status: 'Approved' },
    { id: 2, name: 'Vendor B', status: 'Blocked' },
    { id: 3, name: 'Vendor C', status: 'Approved' },
  ];

  const users = [
    { id: 1, name: 'User A', status: 'Approved' },
    { id: 2, name: 'User B', status: 'Blocked' },
    { id: 3, name: 'User C', status: 'Approved' },
    { id: 4, name: 'User D', status: 'Blocked' },
  ];

  const bookings = [
    { user: 'John Doe', bike: 'Honda Activa', date: '2024-04-20', status: 'Completed' },
    { user: 'Jane Smith', bike: 'Yamaha FZ', date: '2024-04-18', status: 'Ongoing' },
    { user: 'Alice Johnson', bike: 'Suzuki Access', date: '2024-04-17', status: 'Cancelled' },
    { user: 'Bob Brown', bike: 'Royal Enfield', date: '2024-04-16', status: 'Completed' },
  ];

  // Statistics
  const approved = vendors.filter(v => v.status === 'Approved').length;
  const blocked = vendors.filter(v => v.status === 'Blocked').length;
  const approvedUsers = users.filter(u => u.status === 'Approved').length;
  const blockedUsers = users.filter(u => u.status === 'Blocked').length;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 font-poppins">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Welcome to the Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Vendors" value={vendors.length} onClick={() => navigate('/admin/manage-vendors')} />
        <Card title="Approved Vendors" value={approved} borderColor="border-green-500" onClick={() => navigate('/admin/manage-vendors')} />
        <Card title="Blocked Vendors" value={blocked} borderColor="border-red-500" onClick={() => navigate('/admin/manage-vendors')} />
        <Card title="Total Users" value={users.length} borderColor="border-orange-400" onClick={() => navigate('/admin/manage-users')} />
        <Card title="Approved Users" value={approvedUsers} borderColor="border-green-400" onClick={() => navigate('/admin/manage-users')} />
        <Card title="Blocked Users" value={blockedUsers} borderColor="border-red-400" onClick={() => navigate('/admin/manage-users')} />
        <Card title="Active Bikes" value={25} borderColor="border-yellow-500" onClick={() => navigate('/admin/manage-bikes')} />
        <Card title="Active Rentals" value={12} borderColor="border-indigo-500" onClick={() => navigate('/admin/bookings')} />
        <Card title="Earnings This Month" value="₹52,400" borderColor="border-purple-500" onClick={() => navigate('/admin/reports')} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div onClick={() => navigate('/admin/manage-vendors')} className="bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:bg-gray-700 transition duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">Manage Vendors</h3>
          <p className="text-gray-400">Add, approve, block, or remove vendors.</p>
        </div>
        <div onClick={() => navigate('/admin/manage-vendors')} className="bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:bg-gray-700 transition duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">Vendor Dashboard</h3>
          <p className="text-gray-400">View and filter vendor listings.</p>
        </div>
      </div>

      {/* Bookings & Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Table */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-300">
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Bike</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  let formattedDate = 'Invalid Date';
                  try {
                    const d = new Date(b.date);
                    if (!isNaN(d.getTime())) {
                      formattedDate = format(d, 'dd MMM yyyy');
                    }
                  } catch {
                    formattedDate = 'Invalid Date';
                  }
                  return (
                    <tr key={i} className="border-b border-gray-700 text-gray-200">
                      <td className="py-2 px-4">{b.user}</td>
                      <td className="py-2 px-4">{b.bike}</td>
                      <td className="py-2 px-4">{formattedDate}</td>
                      <td className="py-2 px-4"><StatusBadge status={b.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">Active Rental Maps</h2>
          <div className="w-full h-64 bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-400">[Map Placeholder]</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold text-orange-500 mb-4">Pending Approvals</h2>
        <ul className="list-disc list-inside text-gray-400">
          <li>New vendor registration</li>
          <li>New bike listing</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
