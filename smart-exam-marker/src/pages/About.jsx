import React from "react";
import "../styles/About.css";
import aboutTeam from "../assets/about-team.jpg";

export default function About() {
  return (
    <div className="about-page">
      {/* INTRO */}
      <section className="about-intro">
        <h1>About Smart Exam Marker</h1>
        <p>
          Smart Exam Marker was built to empower educators and institutions with an intelligent
          solution for automating exam marking. Our mission is to reduce grading time while
          improving accuracy and transparency.
        </p>
      </section>

      {/* VISION */}
      <section className="about-vision">
        <div className="about-img">
          <img src={aboutTeam} alt="Our Team Working" />
        </div>
        <div className="about-text">
          <h2>Our Vision</h2>
          <p>
            To make education assessment smarter and more accessible through
            automation, machine learning, and human-centered design.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <h2>Core Values</h2>
        <ul>
          <li>✅ Accuracy and Fairness</li>
          <li>✅ Innovation and Integrity</li>
          <li>✅ Data Privacy and Security</li>
        </ul>
      </section>
    </div>
  );
}
