import React, { useState } from "react";

export default function Settings() {
  const [profile, setProfile] = useState({
    username: "Mathankumar",
    email: "mathan@example.com",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "✅ Settings saved successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9.31 18a1.65 1.65 0 0 0-1.81-.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4a2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 3.32 10 1.65 1.65 0 0 0 2 8.5 1.65 1.65 0 0 0 1.67 7 3.3 3.3 0 0 1 .05-3" />
            <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
          </svg>
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Update your profile, preferences, and app settings</p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Settings Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          <p className="text-sm text-gray-500">Update your account details</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Username" name="username" value={profile.username} onChange={handleProfileChange} required />
              <Input label="Email" name="email" value={profile.email} onChange={handleProfileChange} required />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Notification Preferences</h2>
          <p className="text-sm text-gray-500">Choose how you want to be notified</p>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <span>Email Notifications</span>
            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationChange}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <span>SMS Notifications</span>
            <input
              type="checkbox"
              name="sms"
              checked={notifications.sms}
              onChange={handleNotificationChange}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <span>Push Notifications</span>
            <input
              type="checkbox"
              name="push"
              checked={notifications.push}
              onChange={handleNotificationChange}
              className="w-5 h-5"
            />
          </label>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">App Theme</h2>
          <p className="text-sm text-gray-500">Select your preferred interface theme</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={handleThemeChange}
                className="w-5 h-5"
              />
              <span>Light Mode</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={handleThemeChange}
                className="w-5 h-5"
              />
              <span>Dark Mode</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);