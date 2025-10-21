// backend/routes/user.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get logged-in user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, institution, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/update', authMiddleware, async (req, res) => {
  const { name, email, institution } = req.body;

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, institution = ? WHERE id = ?',
      [name, email, institution, req.user.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
