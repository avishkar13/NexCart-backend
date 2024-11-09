const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const validateEmail = require('email-validator');
const router = express.Router();



// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || username.length < 3 || username.length > 30) {
      return res.status(400).json({ message: "Username must be between 3 to 30 characters" });
    }

    if (!email || !validateEmail.validate(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 6);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.status(201).json({ token, message: "User created successfully" });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ message: "Server error, please try again", error: err.message });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12d' });

    // Send response with token
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});



//Account Page Routes

// Fetch User Data
router.get('/user', authenticate, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  
  try {
    const user = await User.findById(req.user.id).select('username email'); // Only select username and email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change Password
router.put('/change-password', authenticate, async (req, res) => {
  res.set('Cache-Control', 'no-store');

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Both old and new passwords are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters long, contain one uppercase letter, one number, and one special character" 
      });
    }

    user.password = await bcrypt.hash(newPassword, 6);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// Delete Account
router.delete('/delete-account', authenticate, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


// Protected Routes (accessible only with valid JWT)
router.get('/home', authenticate, (req, res) => {
  res.json({ message: "You have access to this route" });
});

router.get('/men', authenticate, (req, res) => {
  res.json({ message: "You have access to this route" });
});

router.get('/women', authenticate, (req, res) => {
  res.json({ message: "You have access to this route" });
});

router.get('/kids', authenticate, (req, res) => {
  res.json({ message: "You have access to this route" });
});

router.get('/cart', authenticate, (req, res) => {
  res.json({ message: "You have access to this route" });
});

router.get('/account', authenticate, (req, res) => {
  res.json({ message: "You have access to this route" });
});

module.exports = router;
