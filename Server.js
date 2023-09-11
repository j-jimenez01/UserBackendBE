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

// Registration route
app.post('/api/register', async (req, res) => {
  const { email, password, verificationCode } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Check if the verification code matches the one sent to the user
    if (verificationCode !== 'expected-verification-code') {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Create a new user
    const newUser = new User({ email, password, isVerified: true }); // Mark the user as verified
    await newUser.save();

    res.status(200).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// Send verification email route
app.post('/api/send-verification-email', async (req, res) => {
  const { email } = req.body;
  const verificationCode = 'generate-unique-code-here'; // Generate a unique code for this email

  try {
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

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
