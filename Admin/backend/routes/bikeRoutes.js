const express = require('express');
const router = express.Router();
const { createBike, getAllBikes, upload } = require('../controllers/bikeController');

router.post('/', upload.single('img'), createBike);
router.get('/', getAllBikes);

module.exports = router;
