"use client";

import { useState, useEffect } from "react";
import {
  FaGlobe,
  FaLock,
  FaBell,
  FaLanguage,
  FaSave,
  FaDownload,
  FaUpload,
  FaSun,
  FaUserCircle,
  FaCamera
} from 'react-icons/fa';

const AdminSettings = () => {
  const [general, setGeneral] = useState({
    siteName: "My Bike Rental",
    currency: "INR",
    timeZone: "Asia/Kolkata",
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    itemsPerPage: 10,
    autoRefresh: false,
  });

  const [personal, setPersonal] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    avatar: "https://via.placeholder.com/100 "
  });

  const [avatarPreview, setAvatarPreview] = useState(personal.avatar);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("adminSettings"));
    if (savedSettings) {
      setGeneral(savedSettings.general || general);
      setSecurity({ ...security, currentPassword: "", newPassword: "", confirmPassword: "" });
      setNotifications(savedSettings.notifications || notifications);
      setPreferences(savedSettings.preferences || preferences);
      setPersonal(savedSettings.personal || personal);
      setAvatarPreview(savedSettings.personal?.avatar || avatarPreview);
    }
  }, []);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneral((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
    if (name === "theme") {
      document.documentElement.classList.toggle("dark", value === "dark");
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonal((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAvatarUrl = event.target.result;
      setAvatarPreview(newAvatarUrl);
      setPersonal((prev) => ({ ...prev, avatar: newAvatarUrl }));
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const updatedSettings = {
      general,
      notifications,
      preferences,
      personal
    };

    localStorage.setItem("adminSettings", JSON.stringify(updatedSettings));
    alert("All settings saved successfully!");

    console.log("Saved Settings:", updatedSettings);
  };

  const exportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ general, notifications, preferences, personal }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "admin_settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setGeneral(imported.general || general);
        setNotifications(imported.notifications || notifications);
        setPreferences(imported.preferences || preferences);
        setPersonal(imported.personal || personal);
        setAvatarPreview(imported.personal?.avatar || avatarPreview);
        alert("Settings imported successfully!");
      } catch (error) {
        alert("Failed to parse the file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Admin Settings</h1>

      {/* Personal Settings */}
      <section className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaUserCircle className="mr-2" /> Personal Information
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-orange-500">
              <img
                src={avatarPreview}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-orange-500 p-1 rounded-full cursor-pointer">
                <FaCamera className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div className="md:w-3/4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={personal.firstName}
                  onChange={handlePersonalChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={personal.lastName}
                  onChange={handlePersonalChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={personal.email}
                onChange={handlePersonalChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={personal.phone}
                onChange={handlePersonalChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* General Settings */}
      <section className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaGlobe className="mr-2" /> General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={general.siteName}
              onChange={handleGeneralChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <select
              name="currency"
              value={general.currency}
              onChange={handleGeneralChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="INR">Indian Rupees (INR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Time Zone</label>
            <select
              name="timeZone"
              value={general.timeZone}
              onChange={handleGeneralChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New York</option>
            </select>
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaLock className="mr-2" /> Security Settings
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Enable Two-Factor Authentication</span>
            <button
              onClick={() => setSecurity((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
                security.twoFactorAuth ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  security.twoFactorAuth ? "translate-x-7" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              ></span>
            </button>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={security.currentPassword}
              onChange={handleSecurityChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={security.newPassword}
              onChange={handleSecurityChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={security.confirmPassword}
              onChange={handleSecurityChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaBell className="mr-2" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Email Notifications</span>
            <button
              onClick={() => handleNotificationToggle("email")}
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
                notifications.email ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  notifications.email ? "translate-x-7" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              ></span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>SMS Notifications</span>
            <button
              onClick={() => handleNotificationToggle("sms")}
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
                notifications.sms ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  notifications.sms ? "translate-x-7" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              ></span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>Push Notifications</span>
            <button
              onClick={() => handleNotificationToggle("push")}
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
                notifications.push ? "bg-purple-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  notifications.push ? "translate-x-7" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              ></span>
            </button>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaSun className="mr-2" /> Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Dark Mode</span>
            <button
              onClick={() =>
                handlePreferenceChange({ target: { name: "theme", value: preferences.theme === "dark" ? "light" : "dark" } })
              }
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
                preferences.theme === "dark" ? "bg-orange-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  preferences.theme === "dark" ? "translate-x-7" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              ></span>
            </button>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Language</label>
            <select
              name="language"
              value={preferences.language}
              onChange={handlePreferenceChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Items Per Page</label>
            <select
              name="itemsPerPage"
              value={preferences.itemsPerPage}
              onChange={handlePreferenceChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <span>Auto-refresh Booking List</span>
            <button
              onClick={() =>
                handlePreferenceChange({ target: { name: "autoRefresh", value: !preferences.autoRefresh } })
              }
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
                preferences.autoRefresh ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  preferences.autoRefresh ? "translate-x-7" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              ></span>
            </button>
          </div>
        </div>
      </section>

      {/* Import / Export */}
      <section className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaDownload className="mr-2" /> Import / Export Settings
        </h2>
        <div className="flex gap-4">
          <button
            onClick={exportSettings}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <FaDownload /> Export Settings
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer">
            <FaUpload /> Import Settings
            <input type="file" accept=".json" onChange={handleFileUpload} hidden />
          </label>
        </div>
      </section>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-all"
        >
          <FaSave /> Save All Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;