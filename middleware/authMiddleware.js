const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) return res.status(401).json('Unauthorized');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const user = await User.findById(payload.id);
      if (!user) return res.status(401).json('Unauthorized');
      req.user = user;
      return next();
    }

    // DB not connected: provide a dev user object from token payload
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

    return next();
  } catch (err) {
    return res.status(401).json('Invalid token');
  }
};
