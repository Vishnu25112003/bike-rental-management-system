import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData] = useState({
    email: "madhan@gmail.com", // 📧 Static Email
    password: "123",           // 🔐 Static Password
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚫 Optional: Allow user input but keep defaults prefilled
    // const { email, password } = formData;

    try {
      // 🧪 Simulate login request
      // Replace this block later with real API call
      const email = "madhan@gmail.com";
      const password = "123";

      // ❌ Simulate failure by changing expected password
      const mockApiResponse = {
        status: "success",
        message: "✅ Login successful!",
        data: {
          token: "mock-jwt-token",
        },
      };

      if (email === "madhan@gmail.com" && password === "123") {
        setMessage({ type: "success", text: mockApiResponse.message });

        setTimeout(() => {
          navigate("/dashboard"); // 👉 Redirect to dashboard
        }, 1000);
      } else {
        setMessage({ type: "error", text: "❌ Invalid credentials." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "⚠️ Something went wrong." });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Vendor Login</h2>

        {message.text && (
          <div
            className={`p-3 mb-4 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field (prefilled) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled // 👈 Disable editing (optional)
              onChange={() => {}} // Prevent changes (optional)
              className="w-full px-4 py-2 border rounded-md bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Password Field (prefilled) */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              disabled // 👈 Disable editing (optional)
              onChange={() => {}}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}