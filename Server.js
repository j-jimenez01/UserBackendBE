const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./User'); // Import your User model

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection setup (as previously mentioned)
mongoose.connect('mongodb+srv://Cecs491:Cecs491@users.afanfmt.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB Connection Error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Registration route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(200).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// Update the server to listen on all available network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
