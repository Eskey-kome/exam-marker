import React, { useState } from "react";
import "../styles/UploadExam.css";

export default function FileUploadBox({ title, onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      simulateUpload();
      onUpload(uploadedFile);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      simulateUpload();
      onUpload(uploadedFile);
    }
  };

  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">{title}</h2>
      <div
        className={`upload-box ${dragOver ? "dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <p>Drag & drop your file here, or click to browse</p>
        <input type="file" onChange={handleFileChange} />
      </div>

      {file && (
        <div className="file-info">
          <p>📄 {file.name}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          {progress === 100 && <span className="success-msg">Upload complete!</span>}
        </div>
      )}
    </div>
  );
}
