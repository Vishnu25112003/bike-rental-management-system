const Signup = require('../models/signupModel.js');

// POST: /api/signup
const registerUser = async (req, res) => {
  const { username, mobile, password } = req.body;

  if (!username || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await Signup.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this mobile already exists.' });
    }

    const newUser = new Signup({ username, mobile, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error while signing up.' });
  }
};

module.exports = { registerUser };
