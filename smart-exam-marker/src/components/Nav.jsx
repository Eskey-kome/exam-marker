import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Nav.css";

export default function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/")}>
        SmartExam<span>Marker</span>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

        {!token ? (
          <>
            <Link
              to="/login"
              className="btn-outline"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-outline logout-btn">
              Logout
            </button>
          </>
        )}
      </div>

      {/* Hamburger Icon */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
