const Booking = require("../models/bookingModel");

exports.createBooking = async (req, res) => {
  try {
    const { userDetails, vendorName, bikeDetails, amount, currency, method } = req.body;

    // Validate required fields
    if (!userDetails || !vendorName || !bikeDetails || !amount || !currency || !method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new booking
    const newBooking = new Booking({
      userDetails,
      vendorName,
      bikeDetails,
      amount,
      currency,
      method,
      status: "pending", // Default status
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { status, pickupDate } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status, "bikeDetails.pickupDate": pickupDate },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};