const Signup = require('../models/signupModel');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: 'All fields required.' });
  }

  try {
    const user = await Signup.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'You are not registered!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    res.status(200).json({ message: 'Login Successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error!' });
  }
};

module.exports = { loginUser };
