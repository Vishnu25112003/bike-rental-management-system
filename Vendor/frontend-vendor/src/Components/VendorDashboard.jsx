import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import VendorSidebar from "../Components/VendorSidebar";

const VendorDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-inter flex">
      {/* Fixed Sidebar */}
      <VendorSidebar />
      
      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 lg:ml-80 transition-all duration-300"
      >
        <div className="min-h-screen w-full">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default VendorDashboard;
