// src/components/Footer.jsx
import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} SmartExamMarker. Built with 💡 by
        <a href="https://github.com/antony-005" target="_blank" rel="noreferrer">
          Antony
        </a>
      </p>
    </footer>
  );
}
