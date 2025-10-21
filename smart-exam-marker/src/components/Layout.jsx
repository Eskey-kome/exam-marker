import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Smart Exam Marker — All rights reserved.</p>
      </footer>
    </>
  );
}
