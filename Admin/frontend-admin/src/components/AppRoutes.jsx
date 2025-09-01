import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import DashboardLayout from './DashboardLayout';
import AdminHome from './AdminHome';
import ManageVendors from './ManageVendors';
import ManageUsers from './ManageUsers';
import ManageBookings from './ManageBooking';
import CommissionSettings from './CommissionSettings';
import VendorPayments from './VendorPayments';
import Reports from './Reports';
import Settings from './Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect from the root path to /admin */}
      <Route path="/" element={<Navigate to="/admin" />} />
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="manage-vendors" element={<ManageVendors />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="commissions" element={<CommissionSettings />} />
        <Route path="vendor-payments" element={<VendorPayments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      {/* Catch-all route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;