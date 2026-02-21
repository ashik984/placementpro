const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    return res.status(400).json('Database not connected');
  }

  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashed });
  res.json(user);
});

// Login
router.post('/login', async (req, res) => {
  const mongoConnected = mongoose.connection && mongoose.connection.readyState === 1;

  // Dev fallback when DB isn't available
  if (!mongoConnected) {
    const devEmail = process.env.DEV_FAKE_EMAIL || 'dileep@gmail.com';
    const devPass = process.env.DEV_FAKE_PASSWORD || '123456';
    if (req.body.email === devEmail && req.body.password === devPass) {
      const token = jwt.sign({ id: 'dev-user-id', role: 'student' }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
      return res.json({ token, role: 'student' });
    }
    return res.status(400).json('User not found (no DB)');
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json('User not found');

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json('Invalid password');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, role: user.role });
});

module.exports = router;
