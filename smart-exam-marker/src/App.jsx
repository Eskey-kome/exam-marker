import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadExam from './pages/UploadExam';
import UploadAnswerKey from './pages/UploadKey';
import UploadSubmission from './pages/UploadSubmission';
import MarkExam from './pages/MarkExam';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main style={{ padding: '1rem 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/upload-exam" element={<UploadExam />} />
          <Route path="/upload-key" element={<UploadAnswerKey />} />
          <Route path="/upload-submission" element={<UploadSubmission />} />
          <Route path="/mark-exam" element={<MarkExam />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
