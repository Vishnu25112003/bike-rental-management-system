const express = require('express');
const router = express.Router();
const {
  createBike,
  getAllBikes,
  updateBike,
  deleteBike,
  updateBikeStatus,
  upload
} = require('../controllers/bikeController');

// POST: Create new bike
router.post('/', upload.single('img'), createBike);

// GET: Fetch all bikes
router.get('/', getAllBikes); // ✅ No parentheses

// PUT: Update a bike by ID
router.put('/:id', upload.single('img'), updateBike); // ✅

// DELETE: Delete a bike by ID
router.delete('/:id', deleteBike); // ✅

// PATCH: Update bike status
router.patch('/:id/status', updateBikeStatus); // ✅

module.exports = router;