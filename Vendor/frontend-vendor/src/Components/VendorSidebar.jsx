import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bike,
  Calendar,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const VendorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const location = useLocation();

  const linkClass = "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-slate-800 hover:scale-105";
  const activeClass = "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105";
  const inactiveClass = "text-slate-300 hover:text-white";

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Bikes",
      path: "/dashboard/manage-bikes",
      icon: Bike,
    },
    {
      name: "Bookings",
      path: "/dashboard/bookings",
      icon: Calendar,
    },
    {
      name: "Maintenance",
      path: "/dashboard/maintenance",
      icon: Wrench,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" }
  };

  const textVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 }
  };

  const isActiveLink = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 z-40 shadow-2xl font-inter ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-xl font-bold text-white">Vendor Portal</h1>
                  <p className="text-sm text-slate-400 font-medium">Bike Rental System</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Collapse Button - Desktop Only */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => collapsed && setActiveTooltip(item.name)}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative"
              >
                <NavLink
                  to={item.path}
                  className={`${linkClass} ${
                    isActiveLink(item.path) ? activeClass : inactiveClass
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                  </motion.div>
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                        className="ml-3 font-semibold"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />
                </NavLink>

                {/* Tooltip for collapsed state */}
                <AnimatePresence>
                  {collapsed && activeTooltip === item.name && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg shadow-lg border border-slate-600 whitespace-nowrap z-50"
                    >
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <p className="text-xs text-slate-400 font-medium">© 2025 Bike Rental</p>
                <p className="text-xs text-slate-500">Version 2.0</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default VendorSidebar;
