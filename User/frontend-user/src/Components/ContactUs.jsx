import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [animate, setAnimate] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock check

  useEffect(() => {
    setAnimate(true);

    // Example: Check login status from localStorage or auth context
    const user = localStorage.getItem("userToken");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
  
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
  
      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!");
        e.target.reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-[Poppins] overflow-hidden p-4">
      <div
        className={`relative flex flex-col md:flex-row bg-white rounded-xl border border-gray-200 w-full max-w-5xl shadow-2xl overflow-hidden transform transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } animate-floating`}
      >
        {/* Title Section */}
        <div
          className={`w-full p-6 md:w-1/2 md:p-10 bg-[#fefcf8] flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-gray-300 shadow-inner transform transition duration-700 ${
            animate ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-3 animate-typing overflow-hidden whitespace-nowrap border-r-2 border-orange-500">
            Contact Us
          </h1>
          <p className="text-orange-500 text-lg md:text-xl font-semibold">
            Get in Touch
          </p>
        </div>

        {/* Form Section */}
        <div
          className={`w-full p-6 md:w-1/2 md:p-10 bg-[#fefcf8] transform transition duration-700 ${
            animate ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-black font-bold mb-2">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter Your Name"
                className="w-full p-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 animate-glow"
              />
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Mail Id</label>
              <input
                name="email"
                type="email"
                placeholder="Enter Your Mailid"
                className="w-full p-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 animate-glow"
              />
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Message</label>
              <textarea
                name="message"
                placeholder="Enter Your Description"
                rows={4}
                className="w-full p-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 animate-glow"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 hover:scale-[1.02] transition duration-300 shadow-md"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Spine only on desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-gray-300 shadow-md z-10" />
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Animations */}
      <style>
        {`
        .animate-floating {
          animation: floatUpDown 4s ease-in-out infinite;
        }

        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-typing {
          animation: typing 3s steps(20), blink 0.8s step-end infinite;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink {
          50% { border-color: transparent }
        }

        .animate-glow {
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(251, 146, 60, 0); }
          50% { box-shadow: 0 0 10px rgba(251, 146, 60, 0.4); }
        }
        `}
      </style>
    </div>
  );
};

export default ContactUs;
