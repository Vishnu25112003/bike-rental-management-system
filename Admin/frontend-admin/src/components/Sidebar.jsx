import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiUserCheck, FiClipboard,
  FiDollarSign, FiCreditCard, FiBarChart2, FiSettings
} from 'react-icons/fi';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiHome },
  { to: '/admin/manage-vendors', label: 'Manage Vendors', icon: FiUsers },
  { to: '/admin/manage-users', label: 'Manage Users', icon: FiUserCheck },
  { to: '/admin/bookings', label: 'Bookings', icon: FiClipboard },
  { to: '/admin/commissions', label: 'Commission Setting', icon: FiDollarSign },
  { to: '/admin/vendor-payments', label: 'Vendor Payments', icon: FiCreditCard },
  { to: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings }
];

const SidebarLink = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `relative group flex items-center justify-center md:justify-start px-4 py-3 w-full rounded-lg transition-all duration-200
       ${isActive ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
    }
  >
    <Icon className="w-5 h-5" />

    {/* Label: shown always on md+ screens */}
    <span className="ml-3 text-sm font-medium hidden md:inline">{label}</span>

    {/* Tooltip: only on mobile (<md) */}
    <span className="absolute left-14 z-50 hidden group-hover:flex md:group-hover:hidden md:hidden bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap">
      {label}
      <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800"></span>
    </span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-16 md:w-56 bg-[#111827] flex flex-col py-4 z-50 shadow-lg">
      <nav className="space-y-1 w-full px-1">
        {links.map(({ to, label, icon }) => (
          <SidebarLink key={to} to={to} label={label} Icon={icon} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
