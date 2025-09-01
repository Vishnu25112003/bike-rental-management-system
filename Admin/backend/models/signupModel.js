const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: "" },
  password: { type: String, required: true },
  status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
  profilePicture: { type: String, default: "" },
});

// 🔐 Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
