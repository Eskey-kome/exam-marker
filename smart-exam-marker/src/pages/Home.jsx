import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.jpg";
import dashboardPreview from "../assets/dashboard-preview.jpg";

export default function Home() {
  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>
            Welcome to <span>Smart Exam Marker</span>
          </h1>
          <p>
            The intelligent way to mark exams. Upload scanned papers, answer keys, 
            and let AI-powered automation handle the grading — fast, fair, and accurate.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/about" className="btn-outline">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Smart Exam Marker Hero" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2>Why Choose Smart Exam Marker?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={dashboardPreview} alt="Dashboard Preview" />
            <h3>Real-Time Analytics</h3>
            <p>Visualize student performance instantly with our data-rich dashboard.</p>
          </div>
          <div className="feature-card">
            <img src={heroImg} alt="AI Marking" />
            <h3>AI-Powered Accuracy</h3>
            <p>Automated grading powered by OCR and text comparison for precise results.</p>
          </div>
          <div className="feature-card">
            <img src={dashboardPreview} alt="Insights" />
            <h3>Comprehensive Reports</h3>
            <p>Export full reports and insights with a single click — save hours of work.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2>Start Smart Grading Today</h2>
        <p>Join hundreds of educators who’ve simplified their marking workflow.</p>
        <Link to="/register" className="btn-primary">Join Now</Link>
      </section>
    </div>
  );
}
