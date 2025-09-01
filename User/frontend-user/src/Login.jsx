import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "./assets/Loginbg.jpg";
import google from "./assets/google.png";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/dashboard");
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="bg-gray-500 bg-opacity-80 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-sm z-10">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="mobile">
              Mobile Number
            </label>
            <input
              className="w-full px-4 py-2 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="mobile"
              placeholder="Enter Your Mobile Number"
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 pr-10 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                id="password"
                placeholder="Enter Your Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="bg-orange-500 text-black font-bold py-2 px-4 rounded-2xl w-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center mb-4">
          <span className="text-lg font-semibold">(OR)</span>
        </div>

        <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 shadow-md hover:shadow-lg">
          <img alt="Google logo" className="mr-3 h-5 w-5" src={google} />
          <span>Continue with Google</span>
        </button>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-700">
            Don’t have an account?{" "}
            <button
              className="text-orange-500 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
