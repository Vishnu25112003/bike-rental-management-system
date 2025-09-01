"use client";

import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGasPump,
  FaTachometerAlt,
  FaCogs,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VehicleRentalPage = () => {
  const { state } = useLocation();
  const bike = state?.bike;
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [showPopup, setShowPopup] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeLicense, setAgreeLicense] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const increaseQty = () => {
    if (quantity < bike.quantity) setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handlePickupDateChange = (date) => {
    setPickupDate(date);
    const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    setDropoffDate(nextDay);
  };

  // Calculate total amount (rental + deposit)
  const calculateTotalAmount = () => {
    const rentalAmount = bike.price * quantity;
    const depositAmount = bike.deposit || 2000;
    return {
      rental: rentalAmount,
      deposit: depositAmount,
      total: rentalAmount + depositAmount,
    };
  };

  const handleBuyClick = () => {
    if (!agreeTerms || !agreeLicense) {
      setShowWarning(true);
      return;
    }

    // Show confirmation popup with total amount
    const amounts = calculateTotalAmount();
    Swal.fire({
      title: "Booking Confirmation",
      html: `
        <div class="text-left">
          <p><strong>Rental Amount:</strong> ₹${amounts.rental}</p>
          <p><strong>Deposit Amount:</strong> ₹${amounts.deposit}</p>
          <p class="text-lg font-bold mt-2">Total Amount: ₹${amounts.total}</p>
          <hr class="my-2">
          <p class="text-sm">Please note that the deposit is refundable upon return of the vehicle in good condition.</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Confirm Booking",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to document authentication with total amount
        navigate("/document-authentication", {
          state: {
            totalAmount: amounts.total,
            rentalAmount: amounts.rental,
            depositAmount: amounts.deposit,
            bikeDetails: {
              name: bike.name,
              image: bike.img,
              pickupDate: pickupDate,
              dropoffDate: dropoffDate,
              quantity: quantity,
            },
          },
        });
      }
    });
  };

  if (!bike)
    return <div className="text-center py-10">Bike data not found!</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-roboto pt-24">
      <main className="container mx-auto p-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section */}
            <div className="md:w-2/3">
              <div className="w-full">
                <img
                  src={bike.img || "/placeholder.svg"}
                  alt={bike.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-6">
                <h1 className="text-4xl font-bold text-orange-500">
                  {bike.name}
                </h1>
                <div className="space-y-2 mt-2">
                  <p>
                    Rent Amount:{" "}
                    <span className="font-semibold">₹{bike.price}</span>
                  </p>
                  <p>
                    Refundable Deposit:{" "}
                    <span className="font-semibold">
                      ₹{bike.deposit || 2000}
                    </span>
                  </p>
                  <div className="text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>Pickup location: {bike.vendorName}</span>
                    </div>
                    <div className="text-sm text-gray-700 ml-6">
                      <strong>Available:</strong> {bike.quantity}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center mt-4">
                    <button
                      onClick={decreaseQty}
                      className="border border-gray-300 rounded-l px-3 py-1 bg-gray-100"
                    >
                      -
                    </button>
                    <div className="border-t border-b border-gray-300 px-4 py-1">
                      {quantity}
                    </div>
                    <button
                      onClick={increaseQty}
                      className="border border-gray-300 rounded-r px-3 py-1 bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="relative w-full">
                      <label className="absolute -top-1 left-3 bg-white px-1 text-sm text-gray-600 font-medium z-10 flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        <span>Pickup Date & Time</span>
                      </label>
                      <DatePicker
                        selected={pickupDate}
                        onChange={handlePickupDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none mt-2"
                      />
                    </div>

                    <div className="relative w-full">
                      <label className="absolute -top-1 left-3 bg-white px-1 text-sm text-gray-600 font-medium z-10 flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        <span>Dropoff Date & Time</span>
                      </label>
                      <DatePicker
                        selected={dropoffDate}
                        onChange={(date) => setDropoffDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPopup(true)}
                      className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setShowTermsPopup(true)}
                      className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Terms
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Order Summary and Buy */}
            <div className="bg-gray-50 p-6 md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between font-semibold border-b border-gray-300 pb-2">
                    <span>Subtotal</span>
                    <span>₹{bike.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle Rental Cost</span>
                    <span>₹{bike.price - 120}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Booking Amount</span>
                    <span>₹{bike.price - 120}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (14%)</span>
                    <span>₹{(bike.price * 0.07).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (14%)</span>
                    <span>₹{(bike.price * 0.07).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
                    <span>Payable Amount</span>
                    <span>₹{bike.price}</span>
                  </div>
                </div>
              </div>
              {/* Checkboxes & Buy */}
              <div className="mt-6 space-y-3 text-sm">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    Confirm that you are above 18 and agree to all Terms &
                    Conditions
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={agreeLicense}
                    onChange={(e) => setAgreeLicense(e.target.checked)}
                  />
                  <span>
                    Submit original Driving License at pickup; it will be
                    returned at drop-off.
                  </span>
                </label>
                <button
                  onClick={handleBuyClick}
                  className={`w-full font-bold py-3 px-4 rounded ${
                    agreeTerms && agreeLicense
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Warning Popup */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg text-center max-w-sm mx-auto"
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">Warning</h2>
              <p className="text-gray-600 mb-4">
                Please agree to the terms and license before proceeding!
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl"
          >
            <img
              src={bike.img || "/placeholder.svg"}
              alt={bike.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-extrabold text-center text-orange-500 mb-6">
                {bike.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-md">
                <div>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-orange-500" /> Model Year:{" "}
                    {bike.modelYear}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaTachometerAlt className="text-orange-500" /> Mileage:{" "}
                    {bike.mileage}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCogs className="text-orange-500" /> Engine: {bike.cc} CC
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2">
                    <FaGasPump className="text-orange-500" /> Fuel: {bike.fuel}
                  </p>
                  <p>Extra Charge: {bike.extraCharge}</p>
                  <p>Km Limit: {bike.kmLimit}</p>
                  <p className="mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      ₹{bike.price} / day
                    </span>
                  </p>
                  <p>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                      {bike.quantity} Available
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-full shadow-md transition transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Terms & Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-bold text-orange-500 text-center mb-4">
              Terms & Conditions – {bike.name}
            </h2>
            <ul className="text-gray-700 text-sm list-disc pl-5 space-y-2">
              <li>
                The renter must be above 18 years of age with a valid driving
                license.
              </li>
              <li>
                A refundable deposit of ₹{bike.deposit || 2000} is required at
                pickup.
              </li>
              <li>
                Extra charges: {bike.extraCharge || "₹5/km"} beyond{" "}
                {bike.kmLimit || "250 km"} per day limit.
              </li>
              <li>
                Fuel is not included. Bike must be returned with the same fuel
                level.
              </li>
              <li>
                Any damage to the vehicle will be charged as per the vendor's
                discretion.
              </li>
              <li>
                Pickup and drop-off should be at the same location:{" "}
                {bike.vendorName || "N/A"}.
              </li>
              <li>
                Rental period: From the selected pickup to drop-off date only.
              </li>
              <li>No refunds for early return or unused hours.</li>
              <li>
                All bookings are subject to availability and confirmation.
              </li>
            </ul>
            <div className="text-center mt-6">
              <button
                onClick={() => setShowTermsPopup(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VehicleRentalPage;
