import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VendorDashboard from "../Components/VendorDashboard";
import ManageBikes from "../Components/ManageBikes";
import Bookings from "../Components/Bookings";
import Maintenance from "../Components/Maintenance";
import Dashboard from "../Components/Dashboard";
import VendorSettings from "../Components/VendorSettings";

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Main dashboard layout with nested routes */}
      <Route path="/dashboard" element={<VendorDashboard />}>
        {/* Default dashboard route */}
        <Route index element={<Dashboard />} />
        
        {/* Nested routes */}
        <Route path="manage-bikes" element={<ManageBikes />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>
      
      {/* Catch all routes and redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
