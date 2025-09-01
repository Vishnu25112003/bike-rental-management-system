import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Upload,
  Camera,
  Check,
  X,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Lock,
  Key,
  Globe,
  Calendar,
  Clock,
  DollarSign,
  Edit3,
  Trash2
} from "lucide-react";

const VendorSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileImage, setProfileImage] = useState(null);
  
  // Profile Settings State
  const [profileSettings, setProfileSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    businessName: "",
    businessType: "individual",
    taxId: "",
    website: "",
    bio: "",
    profilePicture: null
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingAlerts: true,
    maintenanceAlerts: true,
    paymentAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    instantAlerts: true,
    reminderNotifications: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    passwordExpiry: 90
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light", // light, dark, system
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "INR",
    sidebarCollapsed: false,
    compactMode: false,
    animations: true
  });

  // Business Settings State
  const [businessSettings, setBusinessSettings] = useState({
    businessHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true }
    },
    autoApproveBookings: true,
    cancellationPolicy: 24,
    advanceBookingDays: 30,
    minimumRentalHours: 4,
    lateReturnFee: 50,
    securityDeposit: 2000
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "business", label: "Business", icon: Settings }
  ];

  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor }
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" }
  ];

  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" }
  ];

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedProfile = localStorage.getItem('vendorProfile');
      const savedNotifications = localStorage.getItem('vendorNotifications');
      const savedSecurity = localStorage.getItem('vendorSecurity');
      const savedAppearance = localStorage.getItem('vendorAppearance');
      const savedBusiness = localStorage.getItem('vendorBusiness');

      if (savedProfile) setProfileSettings(JSON.parse(savedProfile));
      if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
      if (savedSecurity) {
        const security = JSON.parse(savedSecurity);
        // Don't load passwords for security
        delete security.currentPassword;
        delete security.newPassword;
        delete security.confirmPassword;
        setSecuritySettings(prev => ({ ...prev, ...security }));
      }
      if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance));
      if (savedBusiness) setBusinessSettings(JSON.parse(savedBusiness));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage("error", "Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setProfileSettings(prev => ({ ...prev, profilePicture: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    return null;
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!profileSettings.firstName || !profileSettings.lastName || !profileSettings.email) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileSettings.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Phone validation
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
      if (profileSettings.phone && !phoneRegex.test(profileSettings.phone)) {
        throw new Error("Please enter a valid phone number");
      }

      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('vendorProfile', JSON.stringify(profileSettings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showMessage("success", "Profile updated successfully!");
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      localStorage.setItem('vendorNotifications', JSON.stringify(notificationSettings));
      await new Promise(resolve => setTimeout(resolve, 500));
      showMessage("success", "Notification preferences saved!");
    } catch (error) {
      showMessage("error", "Failed to save notification settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      if (securitySettings.newPassword) {
        // Validate current password (in real app, verify with server)
        if (!securitySettings.currentPassword) {
          throw new Error("Please enter your current password");
        }

        // Validate new password
        const passwordError = validatePassword(securitySettings.newPassword);
        if (passwordError) throw new Error(passwordError);

        // Confirm password match
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
          throw new Error("New passwords do not match");
        }
      }

      // Save security settings (excluding passwords)
      const securityToSave = { ...securitySettings };
      delete securityToSave.currentPassword;
      delete securityToSave.newPassword;
      delete securityToSave.confirmPassword;
      
      localStorage.setItem('vendorSecurity', JSON.stringify(securityToSave));
      
      // Clear password fields
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage("success", "Security settings updated successfully!");
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setLoading(true);
    try {
      localStorage.setItem('vendorAppearance', JSON.stringify(appearanceSettings));
      
      // Apply theme changes immediately
      document.documentElement.setAttribute('data-theme', appearanceSettings.theme);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      showMessage("success", "Appearance settings applied!");
    } catch (error) {
      showMessage("error", "Failed to save appearance settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    setLoading(true);
    try {
      localStorage.setItem('vendorBusiness', JSON.stringify(businessSettings));
      await new Promise(resolve => setTimeout(resolve, 500));
      showMessage("success", "Business settings saved successfully!");
    } catch (error) {
      showMessage("error", "Failed to save business settings");
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = (section) => {
    if (window.confirm('Are you sure you want to reset to default settings? This cannot be undone.')) {
      switch (section) {
        case 'notifications':
          setNotificationSettings({
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            bookingAlerts: true,
            maintenanceAlerts: true,
            paymentAlerts: true,
            marketingEmails: false,
            weeklyReports: true,
            instantAlerts: true,
            reminderNotifications: true
          });
          break;
        case 'appearance':
          setAppearanceSettings({
            theme: "light",
            language: "en",
            timezone: "Asia/Kolkata",
            dateFormat: "DD/MM/YYYY",
            timeFormat: "24h",
            currency: "INR",
            sidebarCollapsed: false,
            compactMode: false,
            animations: true
          });
          break;
        default:
          break;
      }
      showMessage("success", "Settings reset to defaults!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-inter">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-slate-600 font-medium">
            Manage your account preferences and business settings
          </p>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-medium">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-left ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-800">Profile Information</h2>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Save Profile
                      </motion.button>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                          {profileImage || profileSettings.profilePicture ? (
                            <img
                              src={profileImage || profileSettings.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-white" />
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => document.getElementById('profileImageInput').click()}
                          className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <Camera className="w-4 h-4 text-slate-600" />
                        </motion.button>
                        <input
                          id="profileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Profile Picture</h3>
                        <p className="text-sm text-slate-600">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={profileSettings.firstName}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={profileSettings.lastName}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your last name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={profileSettings.email}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileSettings.phone}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Address
                        </label>
                        <input
                          type="text"
                          value={profileSettings.address}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileSettings.city}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                        <input
                          type="text"
                          value={profileSettings.state}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          placeholder="Enter your state"
                        />
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="border-t border-slate-200 pt-8">
                      <h3 className="text-xl font-bold text-slate-800 mb-6">Business Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={profileSettings.businessName}
                            onChange={(e) => setProfileSettings(prev => ({ ...prev, businessName: e.target.value }))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                            placeholder="Enter business name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Business Type
                          </label>
                          <select
                            value={profileSettings.businessType}
                            onChange={(e) => setProfileSettings(prev => ({ ...prev, businessType: e.target.value }))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                          >
                            <option value="individual">Individual</option>
                            <option value="partnership">Partnership</option>
                            <option value="company">Company</option>
                            <option value="llp">LLP</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Tax ID / GST Number
                          </label>
                          <input
                            type="text"
                            value={profileSettings.taxId}
                            onChange={(e) => setProfileSettings(prev => ({ ...prev, taxId: e.target.value }))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                            placeholder="Enter tax ID"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Globe className="w-4 h-4 inline mr-2" />
                            Website
                          </label>
                          <input
                            type="url"
                            value={profileSettings.website}
                            onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Bio / Description
                          </label>
                          <textarea
                            value={profileSettings.bio}
                            onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                            rows="4"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium resize-none"
                            placeholder="Tell us about your business..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-800">Notification Preferences</h2>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => resetToDefaults('notifications')}
                          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors duration-200"
                        >
                          Reset
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveNotifications}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                          Save Preferences
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          Email Notifications
                        </h3>
                        <div className="space-y-4">
                          {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive general notifications via email' },
                            { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'Get notified about new bookings and cancellations' },
                            { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Notifications about payments and transactions' },
                            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly business performance reports' },
                            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional content and feature updates' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div>
                                <h4 className="font-semibold text-slate-800">{item.label}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setNotificationSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  notificationSettings[item.key] ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              >
                                <motion.span
                                  animate={{ x: notificationSettings[item.key] ? 20 : 2 }}
                                  transition={{ duration: 0.2 }}
                                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                                />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Bell className="w-5 h-5 text-green-600" />
                          Push Notifications
                        </h3>
                        <div className="space-y-4">
                          {[
                            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in your browser' },
                            { key: 'instantAlerts', label: 'Instant Alerts', desc: 'Real-time notifications for urgent matters' },
                            { key: 'reminderNotifications', label: 'Reminders', desc: 'Get reminders for important tasks and deadlines' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div>
                                <h4 className="font-semibold text-slate-800">{item.label}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setNotificationSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  notificationSettings[item.key] ? "bg-green-600" : "bg-slate-300"
                                }`}
                              >
                                <motion.span
                                  animate={{ x: notificationSettings[item.key] ? 20 : 2 }}
                                  transition={{ duration: 0.2 }}
                                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                                />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SMS Notifications */}
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-purple-600" />
                          SMS Notifications
                        </h3>
                        <div className="space-y-4">
                          {[
                            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                            { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'SMS alerts for vehicle maintenance schedules' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div>
                                <h4 className="font-semibold text-slate-800">{item.label}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setNotificationSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  notificationSettings[item.key] ? "bg-purple-600" : "bg-slate-300"
                                }`}
                              >
                                <motion.span
                                  animate={{ x: notificationSettings[item.key] ? 20 : 2 }}
                                  transition={{ duration: 0.2 }}
                                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                                />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-800">Security Settings</h2>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveSecurity}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Shield className="w-5 h-5" />
                        )}
                        Update Security
                      </motion.button>
                    </div>

                    {/* Password Change */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.current ? "text" : "password"}
                              value={securitySettings.currentPassword}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword.new ? "text" : "password"}
                                value={securitySettings.newPassword}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword.confirm ? "text" : "password"}
                                value={securitySettings.confirmPassword}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {securitySettings.newPassword && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Password Requirements:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li className="flex items-center gap-2">
                                <span className={securitySettings.newPassword.length >= 8 ? "text-green-600" : "text-red-600"}>
                                  {securitySettings.newPassword.length >= 8 ? "✓" : "✗"}
                                </span>
                                At least 8 characters long
                              </li>
                              <li className="flex items-center gap-2">
                                <span className={/[A-Z]/.test(securitySettings.newPassword) ? "text-green-600" : "text-red-600"}>
                                  {/[A-Z]/.test(securitySettings.newPassword) ? "✓" : "✗"}
                                </span>
                                Contains uppercase letter
                              </li>
                              <li className="flex items-center gap-2">
                                <span className={/[a-z]/.test(securitySettings.newPassword) ? "text-green-600" : "text-red-600"}>
                                  {/[a-z]/.test(securitySettings.newPassword) ? "✓" : "✗"}
                                </span>
                                Contains lowercase letter
                              </li>
                              <li className="flex items-center gap-2">
                                <span className={/\d/.test(securitySettings.newPassword) ? "text-green-600" : "text-red-600"}>
                                  {/\d/.test(securitySettings.newPassword) ? "✓" : "✗"}
                                </span>
                                Contains number
                              </li>
                              <li className="flex items-center gap-2">
                                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(securitySettings.newPassword) ? "text-green-600" : "text-red-600"}>
                                  {/[!@#$%^&*(),.?":{}|<>]/.test(securitySettings.newPassword) ? "✓" : "✗"}
                                </span>
                                Contains special character
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Security Preferences */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Security Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                          <div>
                            <h4 className="font-semibold text-slate-800">Two-Factor Authentication</h4>
                            <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              securitySettings.twoFactorEnabled ? "bg-green-600" : "bg-slate-300"
                            }`}
                          >
                            <motion.span
                              animate={{ x: securitySettings.twoFactorEnabled ? 20 : 2 }}
                              transition={{ duration: 0.2 }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            />
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                          <div>
                            <h4 className="font-semibold text-slate-800">Login Alerts</h4>
                            <p className="text-sm text-slate-600">Get notified when someone logs into your account</p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSecuritySettings(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              securitySettings.loginAlerts ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          >
                            <motion.span
                              animate={{ x: securitySettings.loginAlerts ? 20 : 2 }}
                              transition={{ duration: 0.2 }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            />
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <Clock className="w-4 h-4 inline mr-2" />
                              Session Timeout (minutes)
                            </label>
                            <select
                              value={securitySettings.sessionTimeout}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={60}>1 hour</option>
                              <option value={120}>2 hours</option>
                              <option value={480}>8 hours</option>
                            </select>
                          </div>

                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <Key className="w-4 h-4 inline mr-2" />
                              Password Expiry (days)
                            </label>
                            <select
                              value={securitySettings.passwordExpiry}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value={30}>30 days</option>
                              <option value={60}>60 days</option>
                              <option value={90}>90 days</option>
                              <option value={180}>6 months</option>
                              <option value={365}>1 year</option>
                              <option value={0}>Never</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-800">Appearance & Localization</h2>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => resetToDefaults('appearance')}
                          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors duration-200"
                        >
                          Reset
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveAppearance}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Palette className="w-5 h-5" />
                          )}
                          Apply Settings
                        </motion.button>
                      </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-600" />
                        Theme
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                          <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: theme.id }))}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              appearanceSettings.theme === theme.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <theme.icon className={`w-8 h-8 mx-auto mb-2 ${
                              appearanceSettings.theme === theme.id ? "text-blue-600" : "text-slate-400"
                            }`} />
                            <p className="font-semibold text-slate-800">{theme.name}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Language & Region */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Language & Region
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                          <select
                            value={appearanceSettings.language}
                            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="p-4 bg-white rounded-lg">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
                          <select
                            value={appearanceSettings.timezone}
                            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                            <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
                          </select>
                        </div>

                        <div className="p-4 bg-white rounded-lg">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Date Format
                          </label>
                          <select
                            value={appearanceSettings.dateFormat}
                            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                          </select>
                        </div>

                        <div className="p-4 bg-white rounded-lg">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Time Format
                          </label>
                          <select
                            value={appearanceSettings.timeFormat}
                            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="12h">12 Hour (AM/PM)</option>
                            <option value="24h">24 Hour</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Display Settings */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-blue-600" />
                        Display Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <DollarSign className="w-4 h-4 inline mr-2" />
                              Currency
                            </label>
                            <select
                              value={appearanceSettings.currency}
                              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, currency: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              {currencies.map((currency) => (
                                <option key={currency.code} value={currency.code}>
                                  {currency.symbol} {currency.name} ({currency.code})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            { key: 'sidebarCollapsed', label: 'Collapsed Sidebar by Default', desc: 'Start with a collapsed sidebar for more content space' },
                            { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and padding for a more compact interface' },
                            { key: 'animations', label: 'Enable Animations', desc: 'Show smooth transitions and animations throughout the app' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div>
                                <h4 className="font-semibold text-slate-800">{item.label}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setAppearanceSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  appearanceSettings[item.key] ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              >
                                <motion.span
                                  animate={{ x: appearanceSettings[item.key] ? 20 : 2 }}
                                  transition={{ duration: 0.2 }}
                                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                                />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Business Tab */}
                {activeTab === "business" && (
                  <motion.div
                    key="business"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-800">Business Settings</h2>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveBusiness}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Save Settings
                      </motion.button>
                    </div>

                    {/* Business Hours */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Business Hours
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(businessSettings.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex items-center gap-4 p-4 bg-white rounded-lg">
                            <div className="w-24">
                              <p className="font-semibold text-slate-800 capitalize">{day}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setBusinessSettings(prev => ({
                                  ...prev,
                                  businessHours: {
                                    ...prev.businessHours,
                                    [day]: { ...prev.businessHours[day], closed: !prev.businessHours[day].closed }
                                  }
                                }))}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                                  hours.closed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                }`}
                              >
                                {hours.closed ? "Closed" : "Open"}
                              </motion.button>
                              
                              {!hours.closed && (
                                <>
                                  <input
                                    type="time"
                                    value={hours.open}
                                    onChange={(e) => setBusinessSettings(prev => ({
                                      ...prev,
                                      businessHours: {
                                        ...prev.businessHours,
                                        [day]: { ...prev.businessHours[day], open: e.target.value }
                                      }
                                    }))}
                                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <span className="text-slate-500">to</span>
                                  <input
                                    type="time"
                                    value={hours.close}
                                    onChange={(e) => setBusinessSettings(prev => ({
                                      ...prev,
                                      businessHours: {
                                        ...prev.businessHours,
                                        [day]: { ...prev.businessHours[day], close: e.target.value }
                                      }
                                    }))}
                                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Booking Settings */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        Booking Policies
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                          <div>
                            <h4 className="font-semibold text-slate-800">Auto-approve Bookings</h4>
                            <p className="text-sm text-slate-600">Automatically approve booking requests without manual review</p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setBusinessSettings(prev => ({ ...prev, autoApproveBookings: !prev.autoApproveBookings }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              businessSettings.autoApproveBookings ? "bg-green-600" : "bg-slate-300"
                            }`}
                          >
                            <motion.span
                              animate={{ x: businessSettings.autoApproveBookings ? 20 : 2 }}
                              transition={{ duration: 0.2 }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            />
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Cancellation Policy (hours before)
                            </label>
                            <input
                              type="number"
                              value={businessSettings.cancellationPolicy}
                              onChange={(e) => setBusinessSettings(prev => ({ ...prev, cancellationPolicy: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                              max="168"
                            />
                          </div>

                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Advance Booking (days)
                            </label>
                            <input
                              type="number"
                              value={businessSettings.advanceBookingDays}
                              onChange={(e) => setBusinessSettings(prev => ({ ...prev, advanceBookingDays: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                              max="365"
                            />
                          </div>

                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Minimum Rental (hours)
                            </label>
                            <input
                              type="number"
                              value={businessSettings.minimumRentalHours}
                              onChange={(e) => setBusinessSettings(prev => ({ ...prev, minimumRentalHours: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                              max="168"
                            />
                          </div>

                          <div className="p-4 bg-white rounded-lg">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Late Return Fee (₹/hour)
                            </label>
                            <input
                              type="number"
                              value={businessSettings.lateReturnFee}
                              onChange={(e) => setBusinessSettings(prev => ({ ...prev, lateReturnFee: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                            />
                          </div>

                          <div className="p-4 bg-white rounded-lg md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Security Deposit (₹)
                            </label>
                            <input
                              type="number"
                              value={businessSettings.securityDeposit}
                              onChange={(e) => setBusinessSettings(prev => ({ ...prev, securityDeposit: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSettings;
