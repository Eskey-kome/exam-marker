// backend/utils/marking.js
const stringSimilarity = require('string-similarity');

function normalizeText(s) {
  return (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Try to extract an answer for an MCQ question from studentText.
 * We'll look for the question number followed by up to ~60 chars and capture a single letter A-D.
 */
function extractMcqAnswer(studentText, qNumber) {
  const patterns = [
    // Q1: A   or 1) A   or 1. A
    new RegExp(`${qNumber}\\s*[\\)\\:\\.]?\\s*([A-D])\\b`, 'i'),
    // 1 A  (space)
    new RegExp(`${qNumber}\\s+([A-D])\\b`, 'i'),
    // Q1 A
    new RegExp(`q\\s*${qNumber}\\s*[:\\-]?\\s*([A-D])\\b`, 'i')
  ];

  for (const p of patterns) {
    const m = studentText.match(p);
    if (m && m[1]) return m[1].toUpperCase();
  }

  // fallback: search for pattern "1. (A) Option" -- try to find first single-letter A-D near the question number up to 80 chars forward
  const fallback = new RegExp(`${qNumber}([\\s\\S]{0,80})`, 'i');
  const fb = studentText.match(fallback);
  if (fb && fb[1]) {
    const near = fb[1];
    const m2 = near.match(/([A-D])\b/i);
    if (m2) return m2[1].toUpperCase();
  }

  return null;
}

/**
 * Score a single open question using keywords and/or string similarity.
 * - If keywords provided: fraction matched = matchedKeywords / totalKeywords
 * - If answer_text provided: compute similarity between normalized texts (0..1)
 * Combine by averaging available metrics.
 */
function scoreOpenQuestion(studentText, questionKey) {
  const st = normalizeText(studentText);
  let keywordScore = null;
  let textSimScore = null;

  if (Array.isArray(questionKey.keywords) && questionKey.keywords.length > 0) {
    const total = questionKey.keywords.length;
    let matched = 0;
    for (const kw of questionKey.keywords) {
      const nkw = normalizeText(kw);
      if (nkw && st.includes(nkw)) matched++;
    }
    keywordScore = total > 0 ? matched / total : null;
  }

  if (questionKey.answer_text) {
    const expected = normalizeText(questionKey.answer_text);
    if (expected && st) {
      textSimScore = stringSimilarity.compareTwoStrings(expected, st); // 0..1
    }
  }

  // Decide combined score
  const scores = [];
  if (keywordScore !== null) scores.push(keywordScore);
  if (textSimScore !== null) scores.push(textSimScore);

  if (scores.length === 0) return 0;
  const combined = scores.reduce((a,b)=>a+b,0)/scores.length; // average
  return combined; // 0..1
}

/**
 * Main function:
 * - keyJson: parsed JSON object as defined above
 * - studentText: full extracted text from submission
 *
 * Returns: { scorePercent, details: [{ q, format, earned, possible, pass (for open), note }] }
 */
function markSubmission(keyJson, studentText) {
  const questions = keyJson.questions || [];
  let totalWeight = 0;
  const details = [];
  let earnedTotal = 0;

  for (const q of questions) {
    const weight = Number(q.weight || 1);
    totalWeight += weight;
    if (q.format === 'mcq') {
      const found = extractMcqAnswer(studentText, q.q);
      const correct = (q.answer || '').toString().toUpperCase();
      const earned = found && found === correct ? weight : 0;
      const note = `expected ${correct}, found ${found || '—'}`;
      earnedTotal += earned;
      details.push({ q: q.q, format: 'mcq', expected: correct, found, earned, possible: weight, note });
    } else if (q.format === 'open') {
      // score between 0..1
      const fraction = scoreOpenQuestion(studentText, q);
      // threshold: if fraction >= threshold or no threshold defined, then fraction counts
      const threshold = (typeof q.threshold === 'number') ? q.threshold : 0;
      // earned = fraction * weight
      const earned = fraction * weight;
      earnedTotal += earned;
      const pass = fraction >= threshold;
      const note = `fraction=${fraction.toFixed(3)}, threshold=${threshold}`;
      details.push({ q: q.q, format: 'open', fraction: parseFloat(fraction.toFixed(3)), earned: parseFloat(earned.toFixed(3)), possible: weight, pass, note });
    } else {
      // unknown format: skip
      details.push({ q: q.q, format: q.format || 'unknown', earned: 0, possible: weight, note: 'unknown format' });
    }
  }

  const scorePercent = totalWeight > 0 ? (earnedTotal / totalWeight) * 100 : 0;
  return { scorePercent: parseFloat(scorePercent.toFixed(2)), details, totalWeight, earnedTotal: parseFloat(earnedTotal.toFixed(3)) };
}

module.exports = { markSubmission };
