// src/pages/EditorPage.jsx
import React, { useState } from "react";

const EditorPage = () => {
  const [cvContent, setCvContent] = useState("");

  const handleInputChange = (e) => {
    setCvContent(e.target.value);
  };

  const handleSave = () => {
    // Mock save functionality
    console.log("CV Saved:", cvContent);
    alert("Your CV has been saved successfully!");
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
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
      >
        Save CV
      </button>
    </div>
  );
};

export default EditorPage;

