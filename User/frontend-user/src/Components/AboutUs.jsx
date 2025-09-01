"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AboutBg from "../assets/Bikebg6.jpg"

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="w-full h-screen font-[Poppins] overflow-hidden relative">
      {/* Background Image Section with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${AboutBg})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16"
        >
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold mb-4 text-white hover:text-orange-400 transition-all duration-500"
            >
              AboutUs!
            </motion.h1>

            <motion.h2
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-orange-400 text-xl sm:text-3xl mb-6 font-semibold hover:text-orange-500 transition-all duration-500"
            >
              Our Story
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-xl text-gray-200 leading-relaxed"
            >
              At <span className="italic font-semibold text-orange-300">Rideon Rentals</span>, we make bike rentals
              easy, affordable, and hassle-free. Whether it's a city ride or a long trip, our well-maintained bikes
              ensure a smooth journey. With a quick booking process and flexible rental options, you get the freedom to
              ride on your terms.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-base sm:text-xl text-gray-200 mt-4 leading-relaxed"
            >
              Experience convenience, quality, and adventure—all in one ride!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: "#ff6a00" }}
              className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
            >
              Explore Our Fleet
            </motion.button>
          </div>
        </motion.div>

        {/* Right Content - Motorcycle Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex items-center justify-center p-8 relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-full max-w-lg"
          >
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Background Elements
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500/10"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div> */}

      {/* Animation Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}
      </style>
    </div>
  )
}

export default AboutPage
