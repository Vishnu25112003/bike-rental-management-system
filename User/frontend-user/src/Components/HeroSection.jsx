"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom" // Change this line
import Homebg from "../assets/Bikebg7.jpg"

const HeroSection = () => {
  const navigate = useNavigate() // Add this line
  const [menuOpen, setMenuOpen] = useState(false)
  const [typedText, setTypedText] = useState("")
  const fullText = "Rent, Ride, Explore, Repeat!"
  const menuRef = useRef(null)
  const toggleBtnRef = useRef(null)

  const toggleMenu = () => setMenuOpen((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText[index])
      index++
      if (index === fullText.length) clearInterval(interval)
    }, 100) // typing speed

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="relative font-[Poppins]">
      {/* Background Image */}
      <img
        src={Homebg || "/placeholder.svg"}
        alt="A motorcycle parked in a scenic outdoor setting"
        className="w-full h-screen object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">
        {/* Top Navigation */}
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
          {/* Logo */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-2 rounded-md">
            <span className="text-orange-500 text-4xl sm:text-5xl md:text-6xl font-bold leading-none">R</span>
            <div className="flex flex-col text-white">
              <span className="text-base sm:text-lg md:text-xl font-semibold leading-tight">ideOn</span>
              <span className="text-base sm:text-base md:text-xl font-semibold -mt-[0.3em] leading-tight">rental</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 text-white text-lg items-center">
            <li>
              <button
                onClick={() => navigate("/")}
                className="transition-all duration-300 transform hover:text-orange-400 hover:scale-105"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/about")}
                className="transition-all duration-300 transform hover:text-orange-400 hover:scale-105"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/contact")}
                className="transition-all duration-300 transform hover:text-orange-400 hover:scale-105"
              >
                Contact
              </button>
            </li>
            <li>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile"
                className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-white"
              />
            </li>
          </ul>

          {/* Hamburger */}
          <button ref={toggleBtnRef} className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute top-16 left-0 w-full backdrop-blur-md bg-white/10 border-t border-white/20 text-white p-4 z-20 rounded-b-2xl shadow-md"
          >
            <ul className="flex flex-col space-y-3 text-base">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="transition-all duration-300 transform hover:text-orange-400 hover:scale-105"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="transition-all duration-300 transform hover:text-orange-400 hover:scale-105"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="transition-all duration-300 transform hover:text-orange-400 hover:scale-105"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          {/* Center Tagline */}
          <div className="text-center space-y-4">
            {/* Tagline Words Animation */}
            {["Rent", "Ride", "Explore", "Repeat"].map((word, index) => (
              <motion.h1
                key={word}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-orange-500 font-bold leading-tight text-shadow"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.1,
                  color: "#ff6f00",
                  textShadow: "0 0 10px rgba(255, 105, 0, 0.8)",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: index * 0.1, // Staggered delay for each word
                }}
              >
                {word}
              </motion.h1>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeroSection
