const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI;

// Register
router.post('/register', async (req, res) => {
  try {
    if (DEMO_MODE) {
      return res.status(201).json({ message: 'User registered successfully (demo)' });
    }
    const { username, password, role, name, email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      role: role || 'customer',
      name,
      email
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    if (DEMO_MODE) {
      const { username } = req.body;
      const demoUser = { id: 'demo-id', username: username || 'demo', role: 'customer', name: 'Demo User' };
      const token = jwt.sign(
        { id: demoUser.id, username: demoUser.username, role: demoUser.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );
      return res.json({ token, user: demoUser });
    }
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
