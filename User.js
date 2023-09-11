const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Make the password field optional
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
