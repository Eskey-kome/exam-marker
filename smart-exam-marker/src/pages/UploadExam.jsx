import React from "react";
import FileUploadBox from "../components/FileUploadBox";
import "../styles/UploadExam.css";

export default function UploadExam() {
  const handleUpload = (file) => {
    console.log("Exam uploaded:", file);
    // TODO: integrate with backend endpoint
  };

  return (
    <div className="upload-page">
      <h1>Upload Exam Paper</h1>
      <p className="page-desc">
        Upload your exam paper in PDF, DOCX, or TXT format. The system will extract questions automatically.
      </p>
      <FileUploadBox title="Upload Exam Paper" onUpload={handleUpload} />
    </div>
  );
}
