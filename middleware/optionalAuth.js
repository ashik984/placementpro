const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = async function optionalAuth(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

    // If DB connected, fetch user document; otherwise create a dev user object from payload
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      req.user = await User.findById(payload.id);
    } else {
      req.user = {
        _id: payload.id,
        email: process.env.DEV_FAKE_EMAIL || 'dileep@gmail.com',
        name: process.env.DEV_FAKE_NAME || 'Dev User',
        role: payload.role || 'student',
        cgpa: parseFloat(process.env.DEV_CGPA) || 8.5,
        backlogs: 0,
        branch: process.env.DEV_BRANCH || 'CSE',
        skills: [],
        projects: []
      };
    }

    return next();
  } catch (err) {
    // Ignore token errors for optional auth
    return next();
  }
};
