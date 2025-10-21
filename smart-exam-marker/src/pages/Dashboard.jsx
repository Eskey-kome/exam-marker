// src/pages/Dashboard.jsx
import React, { useState } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [examFile, setExamFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [examId, setExamId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  const handleFileSelect = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!examFile || !answerFile || !submissionFile || !studentName) {
      setMessage("❌ Please fill in all fields and select all files.");
      return;
    }
    setMessage("Uploading...");

    try {
      // Upload Exam
      const examForm = new FormData();
      examForm.append("title", "Exam Paper");
      examForm.append("file", examFile);
      const examRes = await fetch("http://localhost:5000/api/uploads/exam", {
        method: "POST",
        body: examForm,
      });
      const examData = await examRes.json();
      if (!examRes.ok) throw new Error(examData.message);
      const exam_id = examData.examId;

      // Upload Answer Key
      const answerForm = new FormData();
      answerForm.append("exam_id", exam_id);
      answerForm.append("file", answerFile);
      const ansRes = await fetch(
        "http://localhost:5000/api/uploads/answer",
        { method: "POST", body: answerForm }
      );
      const ansData = await ansRes.json();
      if (!ansRes.ok) throw new Error(ansData.message);

      // Upload Student Submission
      const subForm = new FormData();
      subForm.append("exam_id", exam_id);
      subForm.append("student_name", studentName);
      subForm.append("file", submissionFile);
      const subRes = await fetch(
        "http://localhost:5000/api/uploads/submission",
        { method: "POST", body: subForm }
      );
      const subData = await subRes.json();
      if (!subRes.ok) throw new Error(subData.message);

      setExamId(exam_id);
      setMessage("✅ All files uploaded successfully. You can now mark the exam.");
    } catch (err) {
      setMessage("❌ Upload failed: " + err.message);
    }
  };

  const handleMarkExam = async () => {
  if (!examId) return setMessage("Upload files first before marking.");

  setMessage("Marking exam...");
  try {
    const res = await fetch(`http://localhost:5000/api/uploads/${examId}/mark`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // ✅ After marking, fetch all results for that exam
    const resultsRes = await fetch(`http://localhost:5000/api/uploads/${examId}/results`);
    const resultsData = await resultsRes.json();
    if (!resultsRes.ok) throw new Error(resultsData.message);

    setResults(resultsData.results);
    setMessage("✅ Marking complete! Results updated.");
  } catch (err) {
    setMessage("❌ Marking failed: " + err.message);
  }
};

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/assets/exam.png" alt="Logo" className="sidebar-logo" />
          <h2>Smart Marker</h2>
        </div>
        <nav>
          <ul>
            <li>📊 Dashboard</li>
            <li>📁 Uploads</li>
            <li>🧮 Mark Exams</li>
            <li>📈 Results</li>
            <li>🚪 Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Banner */}
        <div className="banner">
          <img
            src="/assets/dashboard-banner.jpg"
            alt="Dashboard Banner"
            className="banner-img"
          />
          <div className="banner-text">
            <h1>Smart Exam Marker</h1>
            <p>Upload exams, answer keys, and submissions in one place.</p>
          </div>
        </div>

        {/* Upload Grid */}
        <div className="upload-grid">
          {/* Exam Upload */}
          <div
            className="upload-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, setExamFile)}
          >
            <img src="/assets/exam.png" alt="Exam" />
            <h3>Upload Exam Paper</h3>
            <input
              type="file"
              onChange={(e) => handleFileSelect(e, setExamFile)}
            />
            {examFile && <p>{examFile.name}</p>}
          </div>

          {/* Answer Key Upload */}
          <div
            className="upload-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, setAnswerFile)}
          >
            <img src="/assets/answer.png" alt="Answer Key" />
            <h3>Upload Answer Key</h3>
            <input
              type="file"
              onChange={(e) => handleFileSelect(e, setAnswerFile)}
            />
            {answerFile && <p>{answerFile.name}</p>}
          </div>

          {/* Student Submission Upload */}
          <div className="upload-box">
            <img src="/assets/submission.png" alt="Submission" />
            <h3>Upload Student Submission</h3>

            {/* Student Name Input */}
            <label className="student-label">
              Student Name:
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student's full name"
                className="student-input"
              />
            </label>

            {/* File Upload Drag & Drop */}
            <div
              className="drag-drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, setSubmissionFile)}
            >
              <p>Drag & Drop submission here or click to select file</p>
              <input
                type="file"
                onChange={(e) => handleFileSelect(e, setSubmissionFile)}
              />
              {submissionFile && <p>{submissionFile.name}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleUpload} className="btn-primary">
            Submit All Files
          </button>
          <button onClick={handleMarkExam} className="btn-secondary">
            Mark Exam
          </button>
        </div>

        {/* Status Message */}
        {message && <p className="status-message">{message}</p>}

        {/* Results Table */}
        {results.length > 0 && (
  <div className="results-section">
    <h2>Results</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Student</th>
          <th>Score (%)</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{r.student_name}</td>
            <td>{r.score}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* <button
      className="btn-report"
      onClick={() => window.open(`http://localhost:5000/api/uploads/${examId}/report`, '_blank')}
    >
      📄 Download Results Report (PDF)
    </button> */}
  </div>
)}

        <button
  className="btn-report"
  onClick={() => window.open(`http://localhost:5000/api/uploads/${examId}/report`, '_blank')}
>
  📄 Download Results Report (PDF)
</button>

      </main>
    </div>
  );
}
