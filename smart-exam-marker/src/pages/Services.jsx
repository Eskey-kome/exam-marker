import React from "react";
import "../styles/Services.css";
import aiMarking from "../assets/ai-marking.jpg";
import examUpload from "../assets/exam-upload.jpg";
import learning from "../assets/learning.jpg";

export default function Services() {
  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <p className="services-intro">
        Smart Exam Marker offers a complete suite of digital tools for seamless assessment management.
      </p>

      <div className="service-grid">
        <div className="service-card">
          <img src={aiMarking} alt="AI Marking" />
          <h3>Automatic Marking</h3>
          <p>Upload exams and answer keys — let our system handle the grading automatically.</p>
        </div>

        <div className="service-card">
          <img src={examUpload} alt="Exam Upload" />
          <h3>OCR Processing</h3>
          <p>Extract answers from scanned scripts and handwritten responses using advanced OCR.</p>
        </div>

        <div className="service-card">
          <img src={learning} alt="Learning Insights" />
          <h3>Analytics Dashboard</h3>
          <p>Visualize class performance, trends, and export results to CSV for record-keeping.</p>
        </div>
      </div>
    </div>
  );
}
