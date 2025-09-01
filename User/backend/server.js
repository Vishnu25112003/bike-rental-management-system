const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');  // Import the login routes
const bikeRoutes = require('./routes/bikeRoutes');
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const path = require('path');

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes); // Use the login routes
app.use('/api/bikes', bikeRoutes);
app.use("/api", contactRoutes);
app.use("/api/payments", paymentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
