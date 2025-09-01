const Bike = require('../models/bikeModel');
const multer = require('multer');
const path = require('path');

// 🛠 Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// 📤 Create bike with image file and status
const createBike = async (req, res) => {
  try {
    console.log("📦 File received:", req.file);
    console.log("📝 Body received:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const {
      name,
      price,
      vendorName,
      kmLimit,
      extraCharge,
      fuel,
      deposit,
      modelYear,
      mileage,
      cc,
      quantity,
      status,
    } = req.body;

    // Validate status (must be 'available' or 'in maintenance')
    const bikeStatus = status && ['available', 'in maintenance'].includes(status)
      ? status
      : 'available';

    // Create new bike
    const newBike = new Bike({
      name,
      price,
      vendorName,
      kmLimit,
      extraCharge,
      fuel,
      deposit,
      modelYear,
      mileage,
      cc,
      quantity,
      status: bikeStatus,
      img: `http://localhost:5000/uploads/${req.file.filename}`,
    });

    await newBike.save();
    res.status(201).json({ message: 'Bike created successfully', bike: newBike });

  } catch (err) {
    console.error("🚨 Upload error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📥 Get all bikes
const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.status(200).json(bikes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bikes' });
  }
};

// 📝 Update bike by ID (with optional image)
const updateBike = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const bike = await Bike.findById(id);

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    // Only update fields that are present in the request body
    const allowedFields = [
      'name',
      'price',
      'vendorName',
      'kmLimit',
      'extraCharge',
      'fuel',
      'deposit',
      'modelYear',
      'mileage',
      'cc',
      'quantity',
      'status'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        bike[field] = updates[field];
      }
    });

    // Handle image upload (if new image is provided)
    if (req.file) {
      bike.img = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Validate status (if present)
    if (updates.status && !['available', 'in maintenance'].includes(updates.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await bike.save();

    res.status(200).json({ message: 'Bike updated successfully', bike });

  } catch (err) {
    console.error("🚨 Update error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🗑️ Delete bike by ID
const deleteBike = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBike = await Bike.findByIdAndDelete(id);

    if (!deletedBike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    res.status(200).json({ message: 'Bike deleted successfully' });

  } catch (err) {
    console.error("🚨 Delete error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔄 Update bike status (available / in maintenance)
const updateBikeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status (must be 'available' or 'in maintenance')
  if (!['available', 'in maintenance'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedBike = await Bike.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', bike: updatedBike });

  } catch (err) {
    console.error("🚨 Status update error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBike,
  getAllBikes,
  updateBike,
  deleteBike,
  updateBikeStatus,
  upload,
};
