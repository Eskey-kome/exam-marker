import React from "react";
import FileUploadBox from "../components/FileUploadBox";
import "../styles/UploadExam.css";

export default function UploadKey() {
  const handleUpload = (file) => {
    console.log("Answer key uploaded:", file);
    // TODO: integrate with backend
  };

  return (
    <div className="upload-page">
      <h1>Upload Answer Key</h1>
      <p className="page-desc">
        Upload the correct answers file. The Smart Exam Marker will use it to grade submissions.
      </p>
      <FileUploadBox title="Upload Answer Key File" onUpload={handleUpload} />
    </div>
  );
}
