const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const path = require('path');

// Route imports
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const bikeRoutes = require('./routes/bikeRoutes');
const contactRoutes = require("./routes/contactRoutes");
const maintenanceRoutes = require('./routes/maintenanceRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api', contactRoutes);

// Catch-all route for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));