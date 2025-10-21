import React from "react";
import FileUploadBox from "../components/FileUploadBox";
import "../styles/UploadExam.css";

export default function UploadSubmission() {
  const handleUpload = (file) => {
    console.log("Student submission uploaded:", file);
    // TODO: integrate with backend
  };

  return (
    <div className="upload-page">
      <h1>Upload Student Submission</h1>
      <p className="page-desc">
        Upload the student’s completed exam for automatic marking. Supports scanned images and PDFs.
      </p>
      <FileUploadBox title="Upload Student Submission" onUpload={handleUpload} />
    </div>
  );
}
