const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Added field for email verification status
  verificationCode: { type: String }, // Added field for verification code/token
});

const User = mongoose.model('User', userSchema);

module.exports = User;
