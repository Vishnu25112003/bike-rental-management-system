const Bike = require('../models/bikeModel');
const multer = require('multer');
const path = require('path');

// 🛠 Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// 📤 Create bike with image file
const createBike = async (req, res) => {
    try {
      console.log("📦 File received:", req.file);
      console.log("📝 Body received:", req.body);
  
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
  
      const { name, price, vendorName, kmLimit, extraCharge, fuel, deposit, modelYear, mileage, cc, quantity} = req.body;
  
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
        img: `http://localhost:5000/uploads/${req.file.filename}`,
      });
  
      await newBike.save();
      res.status(201).json({ message: 'Bike created', bike: newBike });
  
    } catch (err) {
      console.error("🚨 Upload error:", err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.status(200).json(bikes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bikes' });
  }
};

module.exports = { createBike, getAllBikes, upload };
