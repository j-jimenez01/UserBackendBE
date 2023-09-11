const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./User'); // Import your User model
const nodemailer = require('nodemailer'); // Import nodemailer for sending verification emails

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect('mongodb+srv://Cecs491:Cecs491@users.afanfmt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB Connection Error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Nodemailer configuration for sending emails through Outlook
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // Outlook SMTP server
  port: 587, // SMTP port for TLS
  secure: false, // false for TLS
  auth: {
    user: 'beacheventsapp@outlook.com', // Your Outlook email address
    pass: 'BeachEvent$2023', // Your Outlook email password or app password
  },
});

// Generate a 6-digit verification code
function generateVerificationCode() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Send verification email route
app.post('/api/send-verification-email', async (req, res) => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode(); // Generate a unique code for this email

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Create a new user record with a temporary verification code (password is not required)
    const newUser = new User({ email, verificationCode });
    await newUser.save();

    // Send a verification email with the code
    await transporter.sendMail({
      from: 'beacheventsapp@outlook.com', // Your Outlook email address
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    });

    res.status(200).json({ message: 'Verification email sent.' });
  } catch (error) {
    console.error('Sending verification email failed:', error);
    res.status(500).json({ message: 'Sending verification email failed.' });
  }
});

// Registration route
app.post('/api/register', async (req, res) => {
  const { email, password, enteredVerificationCode } = req.body;

  try {
    // Find the user by email and temporary verification code
    const user = await User.findOne({ email, verificationCode: enteredVerificationCode });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or verification code.' });
    }

    // Update the user record with the actual password and mark as verified
    if (password) {
      user.password = password;
      user.isVerified = true;
      await user.save();
      res.status(200).json({ message: 'Registration successful.' });
    } else {
      res.status(400).json({ message: 'Password is required for registration.' });
    }
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
