import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Smart<span>Exam</span></h2>
      </div>

      <nav className="sidebar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload-exam">Upload Exam</Link>
        <Link to="/upload-key">Upload Key</Link>
        <Link to="/upload-submission">Upload Submission</Link>
        <Link to="/mark-exam">Mark Exam</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
