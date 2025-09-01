const express = require('express');
const router = express.Router();
const {
  registerUser,
  getAllUsers,
  updateUserStatus,
  updateUser,
  deleteUser
} = require('../controllers/signupController');

// Public route to register
router.post('/', registerUser);

// Admin routes
router.get('/', getAllUsers);
router.put('/:id/status', updateUserStatus);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
