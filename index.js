// index.js

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Core dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');

// Database connection
const pool = require('./db');

// Middleware
const authMiddleware = require('./middleware/authMiddleware');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const uploadRoutes = require('./routes/uploads');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);     // Registration, Login
app.use('/api/user', userRoutes);     // User profile actions
app.use('/api/uploads', uploadRoutes); // Exams, answer keys, submissions

// --- Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ Smart Exam Marker API is running successfully!' });
});

// --- Protected Route Example ---
app.get('/api/protected/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
