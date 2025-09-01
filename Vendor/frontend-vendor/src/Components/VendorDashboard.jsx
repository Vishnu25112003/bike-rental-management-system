import React from "react";
import { Outlet } from "react-router-dom";
import VendorSidebar from "../Components/VendorSidebar";

const VendorDashboard = () => {
  return (
    <div className="flex font-[Poppins]">
      <VendorSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorDashboard;
