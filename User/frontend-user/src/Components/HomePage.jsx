"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import Homebg from "../assets/Bikebg.jpg"
import SearchIcon from "../assets/searchicon.png"
import User from "../assets/profile.png"

// MenuBar Component for Navigation
const MenuBar = ({ menuOpen, toggleMenu, menuRef, toggleBtnRef }) => {
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const loginModalRef = useRef()

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showLoginModal &&
        loginModalRef.current &&
        !loginModalRef.current.contains(e.target)
      ) {
        setShowLoginModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [showLoginModal])

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-4 md:p-6 z-20">
        <div className="flex items-center gap-0.5 sm:gap-1 p-2 rounded-md">
          <span className="text-orange-500 text-4xl sm:text-5xl md:text-6xl font-bold leading-none">R</span>
          <div className="flex flex-col text-white">
            <span className="text-base sm:text-lg md:text-xl font-semibold leading-tight">ideOn</span>
            <span className="text-base sm:text-base md:text-xl font-semibold -mt-[0.3em] leading-tight">rental</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 md:space-x-6 text-white text-sm md:text-lg">
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
          <li className="relative">
            <button
              onClick={() => setShowLoginModal((prev) => !prev)}
              className="focus:outline-none"
              aria-label="User Profile"
            >
              <img
                alt="User profile"
                className="rounded-full w-10 h-10 object-cover border-2 border-white hover:border-orange-400 transition-all duration-300"
                src={User || "/placeholder.svg"}
              />
            </button>

            {/* Login Modal */}
            {showLoginModal && (
              <div
                ref={loginModalRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fadeIn"
              >
                <div className="px-4 py-3 text-center border-b">
                  <p className="text-sm font-medium text-gray-700">You're not logged in</p>
                </div>
                <div className="p-3">
                  <button
                    onClick={() => {
                      navigate("/login")
                      setShowLoginModal(false)
                    }}
                    className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Hamburger Icon */}
        <button ref={toggleBtnRef} className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 w-full bg-white/10 backdrop-blur-md text-white p-4 md:hidden z-30 rounded-b-xl shadow-md"
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
            <li className="pt-3 mt-3 border-t border-gray-300 text-center">
              <button
                onClick={() => {
                  navigate("/login")
                  setMenuOpen(false)
                }}
                className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-orange-600 transition-colors duration-300"
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}

const Homepage = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()
  const toggleBtnRef = useRef()
  const [typingText, setTypingText] = useState("")
  const words = ["Anytime !", "Anywhere !"]
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

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
    const currentWord = words[wordIndex]
    const speed = isDeleting ? 80 : 160

    const timer = setTimeout(() => {
      setTypingText(currentWord.substring(0, charIndex))
      if (!isDeleting && charIndex < currentWord.length) {
        setCharIndex(charIndex + 1)
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(charIndex - 1)
      } else if (!isDeleting && charIndex === currentWord.length) {
        setIsDeleting(true)
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setWordIndex((wordIndex + 1) % words.length)
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, wordIndex])

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value) // Update searchValue when the input changes
  }

  return (
    <header className="relative bg-gray-100 font-[Poppins]">
      {/* Background */}
      <div className="relative w-full h-60 sm:h-96 md:h-screen">
        <img
          alt="A motorcycle in a dark, industrial setting"
          className="w-full h-full object-cover"
          src={Homebg || "/placeholder.svg"}
        />
        <div className="absolute inset-0 bg-black opacity-70 mix-blend-multiply"></div>
      </div>

      {/* MenuBar Component */}
      <MenuBar menuOpen={menuOpen} toggleMenu={toggleMenu} menuRef={menuRef} toggleBtnRef={toggleBtnRef} />

      {/* Tagline */}
      <div
        className={`absolute top-[45%] left-6 sm:left-28 transform -translate-y-1/2 transition-opacity duration-300 z-10 ${
          menuOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-xl sm:text-4xl md:text-5xl text-orange-500 font-bold leading-tight">
          Ride Your Way,
          <br /> <span className="text-white">{typingText}|</span>
        </h1>
      </div>

      {/* Search Section */}
      <div
        className={`absolute bottom-10 left-6 sm:left-28 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] transition-opacity duration-300 z-20 ${
          menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Title */}
        <h2 className="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 pl-6">
          Search your Nearby location
        </h2>

        {/* Stylish Animated Input */}
        <div className="relative group">
          {/* Search Icon (Image Version) */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <img
              src={SearchIcon || "/placeholder.svg"}
              alt="Search Icon"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </div>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchValue.trim() !== "") {
                navigate("/login")
              }
            }}
            className="w-full pl-10 pr-4 py-2 text-gray-800 text-sm sm:text-base rounded-full border-2 border-transparent focus:border-orange-500 transition-all duration-300 placeholder-gray-500 focus:outline-none bg-white shadow-sm focus:shadow-md"
          />
        </div>
      </div>

      {/* Optional Animation Style */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  )
}

export default Homepage