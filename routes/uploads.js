// backend/routes/uploads.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const pool = require('../db');
const { parseFile } = require('../utils/parseFile');
const stringSimilarity = require('string-similarity'); // npm i string-similarity
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Ensure upload folder exists
(async () => {
  try { await fs.mkdir(uploadDir, { recursive: true }); } 
  catch (err) { console.error('Could not create upload directory', err); }
})();

/**
 * Upload Exam
 */
router.post('/exam', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file || !title) return res.status(400).json({ message: 'title and file are required' });

    const filePath = `/uploads/${req.file.filename}`;
    const [result] = await pool.query(
      'INSERT INTO exams (title, file_path) VALUES (?, ?)',
      [title, filePath]
    );

    res.json({ message: 'Exam uploaded', examId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Upload Answer Key
 */
router.post('/answer', upload.single('file'), async (req, res) => {
  try {
    const { exam_id } = req.body;
    if (!req.file || !exam_id) return res.status(400).json({ message: 'exam_id and file are required' });

    const fullPath = path.join(uploadDir, req.file.filename);
    const extractedText = await parseFile(fullPath); // parse content
    await pool.query(
      'INSERT INTO answer_keys (exam_id, file_path, key_text) VALUES (?, ?, ?)',
      [exam_id, `/uploads/${req.file.filename}`, extractedText]
    );

    res.json({ message: 'Answer key uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Upload Student Submission
 */
router.post('/submission', upload.single('file'), async (req, res) => {
  try {
    const { exam_id, student_name } = req.body;
    if (!req.file || !exam_id || !student_name) {
      return res.status(400).json({ message: 'exam_id, student_name, and file are required' });
    }

    const fullPath = path.join(uploadDir, req.file.filename);
    const extractedText = await parseFile(fullPath);

    const [result] = await pool.query(
      'INSERT INTO submissions (exam_id, student_name, file_path, extracted_text) VALUES (?, ?, ?, ?)',
      [exam_id, student_name, `/uploads/${req.file.filename}`, extractedText]
    );

    res.json({ message: 'Submission uploaded successfully', submissionId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Mark Exam with semantic similarity
 */
router.post('/:examId/mark', async (req, res) => {
  try {
    const examId = req.params.examId;

    // Get latest answer key
    const [keyRows] = await pool.query(
      'SELECT * FROM answer_keys WHERE exam_id = ? ORDER BY created_at DESC LIMIT 1',
      [examId]
    );
    if (!keyRows.length) return res.status(400).json({ message: 'No answer key found for exam' });

    const keyText = keyRows[0].key_text || '';
    /**
 * Get all results for a specific exam
 */
router.get('/:examId/results', async (req, res) => {
  try {
    const { examId } = req.params;

    const [results] = await pool.query(`
      SELECT s.student_name, r.score, r.created_at 
      FROM results r
      JOIN submissions s ON r.submission_id = s.id
      WHERE s.exam_id = ?
      ORDER BY r.score DESC
    `, [examId]);

    if (!results.length) {
      return res.status(404).json({ message: 'No results found for this exam' });
    }

    res.json({ message: 'Results fetched successfully', results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching results' });
  }
});


    // Get all submissions
    const [subs] = await pool.query('SELECT * FROM submissions WHERE exam_id = ?', [examId]);
    if (!subs.length) return res.status(400).json({ message: 'No submissions found for this exam' });

    const resultsOut = [];

    for (const s of subs) {
      let studentText = s.extracted_text || '';
      if (!studentText || studentText.trim().length < 5) {
        // parse file if empty
        const fullPath = path.join(uploadDir, path.basename(s.file_path));
        studentText = await parseFile(fullPath);
      }

      // Compute semantic similarity
      const score = Math.round(stringSimilarity.compareTwoStrings(studentText, keyText) * 100);

      // Store result
      const [r] = await pool.query(
        'INSERT INTO results (submission_id, score, details) VALUES (?, ?, ?)',
        [s.id, score, JSON.stringify({ similarity: score })]
      );

      resultsOut.push({
        submission_id: s.id,
        student_name: s.student_name,
        score,
        resultId: r.insertId,
        details: { similarity: score },
      });
    }

    res.json({ message: 'Marking completed', results: resultsOut });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Generate and download PDF report of all marked results
 */
router.get('/:examId/report', async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch exam details
    const [[exam]] = await pool.query('SELECT * FROM exams WHERE id = ?', [examId]);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Fetch all results with student names ordered by score (descending)
    const [results] = await pool.query(`
      SELECT s.student_name, r.score, r.created_at 
      FROM results r
      JOIN submissions s ON r.submission_id = s.id
      WHERE s.exam_id = ?
      ORDER BY r.score DESC
    `, [examId]);

    if (!results.length) return res.status(400).json({ message: 'No results found for this exam' });

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    const filename = `Exam_Report_${examId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Stream PDF directly to response
    doc.pipe(res);

    // Title
    doc.fontSize(22).text('Smart Exam Marker Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Exam Title: ${exam.title}`, { align: 'left' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Table headers
    doc.fontSize(14).text('Student Name', 70, doc.y, { continued: true });
    doc.text('Score (%)', 350, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Results list
    results.forEach((r, i) => {
      doc.moveDown(0.3);
      doc.fontSize(12)
        .text(`${i + 1}. ${r.student_name}`, 70, doc.y, { continued: true })
        .text(`${r.score.toFixed(2)}%`, 350, doc.y);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text('Smart Exam Marker © 2025', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating report' });
  }
});

module.exports = router;
