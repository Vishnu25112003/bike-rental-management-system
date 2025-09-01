const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const app = express();

connectDB();

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const commissionRoutes = require("./routes/commissionRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// API routes
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", paymentRoutes);
app.use("/api/commission", commissionRoutes);
app.use("/api/bookings", bookingRoutes); // ✅ Correct route registration

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));