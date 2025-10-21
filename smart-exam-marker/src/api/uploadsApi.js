// src/api/uploadsApi.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function uploadExam({ title, file }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('file', file);
  const res = await fetch(`${BASE_URL}/api/uploads/exam`, { method: 'POST', body: fd });
  return res.json();
}

export async function uploadAnswerKey({ exam_id, file }) {
  const fd = new FormData();
  fd.append('exam_id', exam_id);
  fd.append('file', file);
  const res = await fetch(`${BASE_URL}/api/uploads/answer`, { method: 'POST', body: fd });
  return res.json();
}

export async function uploadSubmission({ exam_id, student_name, file }) {
  const fd = new FormData();
  fd.append('exam_id', exam_id);
  fd.append('student_name', student_name);
  fd.append('file', file);
  const res = await fetch(`${BASE_URL}/api/uploads/submission`, { method: 'POST', body: fd });
  return res.json();
}

export async function markExam(examId) {
  const res = await fetch(`${BASE_URL}/api/uploads/${examId}/mark`, { method: 'POST' });
  return res.json();
}

export async function getExamResults(examId) {
  const res = await fetch(`${BASE_URL}/api/uploads/${examId}/results`);
  return res.json();
}
