const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginController');

router.post('/login', loginUser); // <-- this matches /api/login/login

module.exports = router;
