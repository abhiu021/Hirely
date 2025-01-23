// src/components/CVEditor.jsx
import React, { useState } from "react";

const CVEditor = () => {
  const [cvContent, setCvContent] = useState("");

  const handleInputChange = (e) => {
    setCvContent(e.target.value);
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-4">CV Editor</h1>
      <textarea
        value={cvContent}
        onChange={handleInputChange}
        className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start editing your CV here..."
      ></textarea>
    </div>
  );
};

export default CVEditor;
