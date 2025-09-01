"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTimes,
  FaQuestionCircle,
  FaHeadset,
  FaShieldAlt,
  FaFileContract,
  FaRegWindowClose,
} from "react-icons/fa"

const Footer = () => {
  const navigate = useNavigate()
  const [activeModal, setActiveModal] = useState(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Function to open a specific modal
  const openModal = (modalName) => setActiveModal(modalName)

  // Function to close the modal
  const closeModal = () => setActiveModal(null)

  // Modal content configurations
  const modalContents = {
    address: {
      title: "Our Address",
      content: (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <FaMapMarkerAlt className="text-orange-500 w-6 h-6 mr-3 flex-shrink-0" />
            <p className="text-gray-700">RideOn Rentals, 1234 Avenue St, City, State, 56789</p>
          </div>
          <div className="flex items-center mb-3">
            <FaPhoneAlt className="text-orange-500 w-6 h-6 mr-3 flex-shrink-0" />
            <p className="text-gray-700">+1 800 123 4567</p>
          </div>
          <div className="flex items-center mb-3">
            <FaEnvelope className="text-orange-500 w-6 h-6 mr-3 flex-shrink-0" />
            <p className="text-gray-700">info@rideonrentals.com</p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-around mt-6">
            <motion.a
              whileHover={{ scale: 1.2, color: "#4267B2" }}
              href="#"
              className="text-gray-400"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: "#E1306C" }}
              href="#"
              className="text-gray-400"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: "#25D366" }}
              href="#"
              className="text-gray-400"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="w-6 h-6" />
            </motion.a>
          </div>
        </div>
      ),
      icon: <FaMapMarkerAlt className="text-orange-500 w-8 h-8" />,
      width: "md:w-96",
    },
    faq: {
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {[
            {
              question: "How do I rent a bike?",
              answer:
                "Simply create an account, browse our available bikes, select your preferred dates, and complete the booking process. You'll receive a confirmation email with all the details.",
            },
            {
              question: "What documents do I need?",
              answer:
                "You'll need a valid driver's license, a credit card for the security deposit, and proof of identity (passport or ID card).",
            },
            {
              question: "Is there a security deposit?",
              answer:
                "Yes, we require a refundable security deposit that varies depending on the bike model. The deposit is returned after the bike is returned in good condition.",
            },
            {
              question: "Can I extend my rental period?",
              answer:
                "Yes, you can extend your rental period by contacting our customer service at least 24 hours before your scheduled return time, subject to availability.",
            },
            {
              question: "What happens if I return the bike late?",
              answer:
                "Late returns are subject to additional charges. Please contact us if you anticipate returning the bike later than scheduled.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      ),
      icon: <FaQuestionCircle className="text-orange-500 w-8 h-8" />,
      width: "md:w-[600px]",
    },
    helpCenter: {
      title: "Help Center",
      content: (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-gray-700">
            Our support team is here to help you with any questions or issues you might have.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <motion.div whileHover={{ scale: 1.03 }} className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaPhoneAlt className="text-orange-500 mr-2" /> Phone Support
              </h4>
              <p className="text-gray-600">Available 24/7</p>
              <p className="text-gray-800 font-medium mt-2">+1 800 123 4567</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaEnvelope className="text-orange-500 mr-2" /> Email Support
              </h4>
              <p className="text-gray-600">Response within 24 hours</p>
              <p className="text-gray-800 font-medium mt-2">support@rideonrentals.com</p>
            </motion.div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Common Issues</h4>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li>Booking modifications</li>
              <li>Payment issues</li>
              <li>Rental extensions</li>
              <li>Damage reports</li>
              <li>Account management</li>
            </ul>
          </div>
        </div>
      ),
      icon: <FaHeadset className="text-orange-500 w-8 h-8" />,
      width: "md:w-[500px]",
    },
    privacyPolicy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-gray-700">Last updated: May 11, 2023</p>

          {[
            {
              title: "Information We Collect",
              content:
                "We collect personal information that you provide directly to us, such as your name, email address, phone number, payment information, driver's license details, and other information you choose to provide.",
            },
            {
              title: "How We Use Your Information",
              content:
                "We use your information to process your rental requests, communicate with you about your rentals, improve our services, and comply with legal obligations.",
            },
            {
              title: "Information Sharing",
              content:
                "We may share your information with service providers who perform services on our behalf, such as payment processing and data analysis. We may also share information when required by law or to protect our rights.",
            },
            {
              title: "Data Security",
              content:
                "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.",
            },
            {
              title: "Your Rights",
              content:
                "Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, or delete your data.",
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <h4 className="font-semibold text-gray-800 mb-2">{section.title}</h4>
              <p className="text-gray-600">{section.content}</p>
            </motion.div>
          ))}
        </div>
      ),
      icon: <FaShieldAlt className="text-orange-500 w-8 h-8" />,
      width: "md:w-[600px]",
    },
    termsConditions: {
      title: "Terms & Conditions",
      content: (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-gray-700">Last updated: May 11, 2023</p>

          {[
            {
              title: "Rental Eligibility",
              content:
                "Renters must be at least 21 years old with a valid driver's license and credit card in their name.",
            },
            {
              title: "Reservation and Payment",
              content:
                "Full payment is required at the time of booking. We accept major credit cards and digital payment methods.",
            },
            {
              title: "Security Deposit",
              content:
                "A security deposit is required and will be refunded within 7 business days after the bike is returned in good condition.",
            },
            {
              title: "Cancellation Policy",
              content:
                "Cancellations made 48 hours or more before the rental start time receive a full refund. Cancellations within 48 hours receive a 50% refund.",
            },
            {
              title: "Damage and Liability",
              content:
                "Renters are responsible for any damage to the bike during the rental period. Insurance options are available for purchase.",
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <h4 className="font-semibold text-gray-800 mb-2">{section.title}</h4>
              <p className="text-gray-600">{section.content}</p>
            </motion.div>
          ))}

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="accept-terms"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
            />
            <label htmlFor="accept-terms" className="ml-2 text-gray-700">
              I have read and agree to the Terms & Conditions
            </label>
          </div>
        </div>
      ),
      icon: <FaFileContract className="text-orange-500 w-8 h-8" />,
      width: "md:w-[600px]",
      acceptButton: true,
    },
    cancellationPolicy: {
      title: "Cancellation Policy",
      content: (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-gray-700">We understand that plans can change. Here's our cancellation policy:</p>

          <div className="space-y-4 mt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-green-50 p-4 rounded-lg border border-green-100"
            >
              <h4 className="font-semibold text-gray-800 mb-2">48+ Hours Before Rental</h4>
              <p className="text-gray-600">Full refund of the rental amount</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 p-4 rounded-lg border border-yellow-100"
            >
              <h4 className="font-semibold text-gray-800 mb-2">24-48 Hours Before Rental</h4>
              <p className="text-gray-600">50% refund of the rental amount</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-red-50 p-4 rounded-lg border border-red-100"
            >
              <h4 className="font-semibold text-gray-800 mb-2">Less than 24 Hours Before Rental</h4>
              <p className="text-gray-600">No refund available</p>
            </motion.div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Special Circumstances</h4>
            <p className="text-gray-600">
              In case of severe weather conditions or other extenuating circumstances, please contact our customer
              service team for assistance.
            </p>
          </div>

          <div className="mt-6">
            <select className="w-full p-2 border border-gray-300 text-black rounded-md focus:ring-orange-500 focus:border-orange-500">
              <option value="">Select a reason for cancellation</option>
              <option value="change_plans">Change of plans</option>
              <option value="found_alternative">Found an alternative</option>
              <option value="weather">Weather concerns</option>
              <option value="emergency">Personal emergency</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      ),
      icon: <FaRegWindowClose className="text-orange-500 w-8 h-8" />,
      width: "md:w-[500px]",
    },
  }

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  }

  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <footer className="bg-black text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold mb-4"
            >
              Ride<span className="text-orange-500">On</span> Rentals
            </motion.div>
            <p className="text-gray-400 max-w-xs">Your trusted partner for premium vehicle rentals.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => navigate("/")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Home
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => navigate("/about")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    About Us
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => openModal("address")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Address
                  </motion.button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => navigate("/contact")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Contact
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => openModal("faq")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    FAQs
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => openModal("helpCenter")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Help Center
                  </motion.button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => openModal("privacyPolicy")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => openModal("termsConditions")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Terms & Conditions
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5, color: "#f97316" }}
                    onClick={() => openModal("cancellationPolicy")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Cancellation Policy
                  </motion.button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} RideOn Rentals. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <motion.a whileHover={{ y: -3, color: "#4267B2" }} href="#" className="text-gray-400" aria-label="Facebook">
              <FaFacebook className="w-5 h-5" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3, color: "#E1306C" }}
              href="#"
              className="text-gray-400"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </motion.a>
            <motion.a whileHover={{ y: -3, color: "#25D366" }} href="#" className="text-gray-400" aria-label="WhatsApp">
              <FaWhatsapp className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Modal System */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
          >
            <motion.div
              className={`bg-white rounded-xl shadow-2xl w-full max-w-sm ${modalContents[activeModal].width} overflow-hidden`}
              variants={modalVariants}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  {modalContents[activeModal].icon}
                  <h3 className="text-xl font-semibold text-gray-800">{modalContents[activeModal].title}</h3>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6">{modalContents[activeModal].content}</div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {modalContents[activeModal].acceptButton ? (
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors flex-1"
                    >
                      Decline
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      disabled={!acceptTerms}
                      className={`px-4 py-2 rounded flex-1 transition-colors ${
                        acceptTerms
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Accept
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    Close
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

export default Footer
