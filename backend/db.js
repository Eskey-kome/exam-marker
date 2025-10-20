const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

console.log('DB config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***hidden***' : '(empty)',
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_exam_marker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

// TEMP TEST: Check if DB connects properly
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected successfully to MySQL');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();
