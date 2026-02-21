const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Dev-only: seed a test user. Enabled only when NODE_ENV !== 'production'
router.post('/seedUser', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Not allowed in production' });
  try {
    const existing = await User.findOne({ email: 'dileep@gmail.com' });
    if (existing) return res.json({ message: 'User already exists', user: existing });

    const hashed = await bcrypt.hash('123456', 10);
    const user = await User.create({
      name: 'Dileep',
      email: 'dileep@gmail.com',
      password: hashed,
      role: 'student',
      cgpa: 8.5,
      backlogs: 0,
      branch: 'CSE',
      skills: ['JS','Node'],
      projects: ['Project A','Project B']
    });
    return res.json({ message: 'Seeded', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seeding failed' });
  }
});

module.exports = router;
