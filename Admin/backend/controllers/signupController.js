const Signup = require('../models/signupModel.js');

// POST /api/signup - Register new user
const registerUser = async (req, res) => {
  const { username, mobile, password, email, profilePicture } = req.body;
  if (!username || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await Signup.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new Signup({ username, mobile, email: email || "", password, profilePicture, status: "Active" });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error while signing up.' });
  }
};

// GET /api/signup - Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Signup.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// PUT /api/signup/:id/status - Toggle user status
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Active', 'Blocked'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const user = await Signup.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(user);
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Error updating user status." });
  }
};

// PUT /api/signup/:id - Edit user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, phone, status } = req.body;

  try {
    const user = await Signup.findByIdAndUpdate(
      id,
      { username, mobile: phone, status },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Error updating user." });
  }
};

// DELETE /api/signup/:id - Remove user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Signup.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user." });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  updateUserStatus,
  updateUser,
  deleteUser
};
