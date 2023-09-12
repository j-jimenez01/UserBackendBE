const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./User');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'beacheventsapp@outlook.com',
    pass: 'BeachEvent$2023',
  },
});

function generateVerificationCode() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/api/send-verification-email', async (req, res) => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode();

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Check if the email matches the required domain
    if (!email.endsWith('@student.csulb.edu')) {
      return res.status(400).json({ message: 'Invalid email domain. Use @student.csulb.edu.' });
    }

    const newUser = new User({ email, verificationCode });
    await newUser.save();

    await transporter.sendMail({
      from: 'beacheventsapp@outlook.com',
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

app.post('/api/register', async (req, res) => {
  const { email, password, verificationCode } = req.body;

  try {
    // Check if the email matches the required domain
    if (!email.endsWith('@student.csulb.edu')) {
      return res.status(400).json({ message: 'Invalid email domain. Use @student.csulb.edu.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email not found.' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

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

// New API endpoint for user authentication
app.post('/api/authenticate', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email not found.' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Email not verified. Please check your email for a verification code.' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // User authentication successful
    res.status(200).json({ message: 'Authentication successful.' });
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).json({ message: 'Authentication failed.' });
  }
});

// FOR HOME
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

// // FOR SCHOOL
// app.listen(port, '10.39.69.121', () => {
//   console.log(`Server is running on http://10.39.69.121:${port}`);
// });
