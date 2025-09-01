"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Homebg from "../assets/Bikebg8.jpg";
import { useLocation } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const toggleBtnRef = useRef();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleScroll = () => {
    const vendorSection = document.getElementById("vendor-section");
    if (vendorSection) {
      vendorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="relative bg-black text-white font-[Poppins]">
      <img
        src={Homebg || "/placeholder.svg"}
        alt="A motorcycle parked in a scenic outdoor setting"
        className="w-full h-screen object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-4 md:p-6">
          {/* Logo */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-2 rounded-md">
            <span className="text-orange-500 text-4xl sm:text-5xl md:text-6xl font-bold leading-none">
              R
            </span>
            <div className="flex flex-col text-white">
              <span className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
                ideOn
              </span>
              <span className="text-base sm:text-base md:text-xl font-semibold -mt-[0.3em] leading-tight">
                rental
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-4 md:space-x-6 text-sm md:text-base items-center">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-orange-500"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/about")}
                className="hover:text-orange-500"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/contact")}
                className="hover:text-orange-500"
              >
                Contact
              </button>
            </li>
            <li>
              <img
                src="https://storage.googleapis.com/a1aa/image/UXSGhObe3tltLEtGNJrXkXr8UAwfj4preR0Mgs2pz3o.jpg"
                alt="Profile"
                className="rounded-full w-9 h-9 object-cover"
              />
            </li>
          </ul>

          {/* Hamburger Icon */}
          <button
            ref={toggleBtnRef}
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden w-full p-6 text-white text-base space-y-4 relative z-30"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              WebkitBoxReflect:
                "below 0px linear-gradient(transparent, rgba(255,255,255,0.2))",
            }}
          >
            <ul className="flex flex-col space-y-3">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-orange-500 transition-all duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="hover:text-orange-500 transition-all duration-200"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="hover:text-orange-500 transition-all duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Taglines + Down Arrow */}
        <div className="text-center mt-20">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-orange-500"
          >
            Your Bikes, Our Platform
          </motion.h1>
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-2xl md:text-3xl text-orange-500 mt-2"
          >
            Explore the Perfect Ride Today!
          </motion.h2>

          {/* Down Arrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={handleScroll}
              className="bg-transparent text-orange-500 hover:text-white text-5xl animate-bounce focus:outline-none"
            >
              ⮯
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Search;
