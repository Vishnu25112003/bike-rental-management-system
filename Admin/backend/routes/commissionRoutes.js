const express = require('express');
const router = express.Router();
const { getCommission, saveCommission } = require('../controllers/commissionController');

// GET commission settings
router.get('/', getCommission);

// POST to create or update commission settings
router.post('/', saveCommission);

module.exports = router;
