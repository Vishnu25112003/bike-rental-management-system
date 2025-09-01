import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "./assets/Loginbg.jpg";
import google from "./assets/google.png";
import { Eye, EyeOff } from "lucide-react";

function SignUp() {
  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const togglePassword = () => setShowPassword((prev) => !prev);

  // 🔒 Only allow letters for username
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z]*$/.test(value)) {
      setUsername(value);
    }
  };

  // 🔢 Only allow numbers for mobile
  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setMobile(value);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!username || !mobile || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const userData = { username, mobile, password };

    try {
      // Send POST request to backend
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, mobile, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success, redirect to login page
        alert("Sign Up Successful! You can now log in.");
        navigate("/login");
      } else {
        // Handle errors
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while signing up.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div
        className={`${
          animate
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95"
        } transform transition-all duration-700 ease-out bg-gray-500 bg-opacity-80 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-sm z-10`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full px-4 py-2 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="username"
              placeholder="Enter Your Username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="mobile"
            >
              Mobile number
            </label>
            <input
              className="w-full px-4 py-2 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="mobile"
              placeholder="Enter Your Mobile No"
              type="text"
              maxLength={10}
              value={mobile}
              onChange={handleMobileChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 pr-10 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                id="password"
                placeholder="Create a Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={togglePassword}
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
              Sign Up
            </button>
          </div>

          <div className="text-center mb-4">
            <span className="text-lg font-semibold">(OR)</span>
          </div>

          <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 shadow-md hover:shadow-lg">
            <img alt="Google logo" className="mr-3 h-5 w-5" src={google} />
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-700">
            Already have an account?{" "}
            <button
              className="text-orange-500 hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
