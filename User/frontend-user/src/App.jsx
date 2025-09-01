"use client"

import { useRef } from "react"
import { Routes, Route } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"

import Header from "./Components/Header"
import HomePage from "./Components/HomePage"
import ExploreSection from "./Components/ExploreSecton"
import AboutUs from "./Components/AboutUs"
import ContactUs from "./Components/ContactUs"
import Footer from "./Components/Footer"
import Login from "./Login"
import SignUp from "./SignUp"
import HeroSection from "./Components/HeroSection"
import Preference from "./Components/preference"
import Search from "./Components/Search"
import VendorCard from "./Components/VendorCard"
import VehicleRentalPage from "./Components/VehicleRentalPage"
import DocumentAuthentication from "./Components/DocumentAuthentication"
import Payment from "./Components/Payment"

function App() {
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const MainPage = () => (
    <>
      <HomePage />
      <ExploreSection />
      <div ref={aboutRef}>
        <AboutUs />
      </div>
      <div ref={contactRef}>
        <ContactUs />
      </div>
      <Footer />
    </>
  )

  const DashboardPage = () => (
    <>
      <HeroSection />
      <Preference />
      <Footer />
    </>
  )

  const SearchResultsPage = () => (
    <>
      <Search />
      <VendorCard />
      <Footer />
    </>
  )

  const VehicleRentalFullPage = () => (
    <>
      <Header />
      <VehicleRentalPage />
      <Footer />
    </>
  )

  // 🔥 NEW COMPONENT : Document Authentication Full Page
  const DocumentAuthenticationFullPage = () => (
    <>
      <Header />
      <DocumentAuthentication />
      <Footer />
    </>
  )

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/results" element={<SearchResultsPage />} />
        <Route path="/vehicle-rental" element={<VehicleRentalFullPage />} />
        <Route path="/document-authentication" element={<DocumentAuthenticationFullPage />} /> {/* ✅ Added properly */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      {/* <Payment/> */}
    </>
  )
}

export default App
