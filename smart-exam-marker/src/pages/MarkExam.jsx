// src/pages/MarkExam.jsx
import React, { useState } from "react";
import "../styles/MarkExam.css";

export default function MarkExam() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleMarkExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    try {
      // Example fetch call to backend endpoint
      const response = await fetch("http://localhost:5000/api/uploads/mark", {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error marking exams");

      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="markexam-container">
      <h1>🧠 Mark Exams Automatically</h1>
      <p className="subtitle">
        The Smart Exam Marker uses intelligent algorithms and OCR to analyze student
        answers against the uploaded answer key.
      </p>

      <div className="markexam-card">
        <h2>Start the Marking Process</h2>
        <p>
          Once you've uploaded your <strong>exam file</strong>, <strong>answer key</strong>, and <strong>submissions</strong>, click below to start automated grading.
        </p>

        <button className="btn-primary" onClick={handleMarkExam} disabled={loading}>
          {loading ? "Marking in progress..." : "Start Marking"}
        </button>

        {error && <div className="alert error">{error}</div>}
        {results && (
          <div className="results-section">
            <h3>Results Overview</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Score (%)</th>
                  <th>Graded On</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td>{r.studentName}</td>
                    <td>{r.score}</td>
                    <td>{new Date().toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>💡 How It Works</h3>
        <ol>
          <li>Upload your exam paper (PDF, Word, or scanned image).</li>
          <li>Upload the answer key file.</li>
          <li>Upload all student submissions.</li>
          <li>Click <strong>Start Marking</strong> — the system compares and scores responses automatically.</li>
          <li>View and export results directly from the dashboard.</li>
        </ol>
      </div>
    </div>
  );
}
