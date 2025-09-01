import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiUser, FiBell } from 'react-icons/fi';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/admin/settings');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <div className="md:hidden flex items-center justify-between bg-gray-800 px-4 py-3 shadow-md z-10">
          <h1 className="text-lg font-semibold text-orange-500">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="focus:outline-none">
              <FiBell className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
            <button className="focus:outline-none" onClick={handleProfileClick}>
              <FiUser className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end bg-gray-800 px-6 py-3 shadow-md z-10">
          <div className="flex items-center gap-6">
            <button className="focus:outline-none">
              <FiBell className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
            <button className="focus:outline-none" onClick={handleProfileClick}>
              <FiUser className="w-8 h-8 text-gray-400 hover:text-white cursor-pointer" />
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;