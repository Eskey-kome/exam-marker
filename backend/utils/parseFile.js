// backend/utils/parseFile.js
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function parseFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.pdf') {
      const data = await fs.readFile(filePath);
      const parsed = await pdfParse(data);
      return parsed.text || '';
    } else if (ext === '.docx') {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } else {
      // plain text or other; try to read as utf8
      const txt = await fs.readFile(filePath, 'utf8');
      return txt || '';
    }
  } catch (err) {
    console.error('parseFile error:', err);
    return '';
  }
}

module.exports = { parseFile };
