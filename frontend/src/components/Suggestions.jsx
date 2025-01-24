import React, { useState } from 'react';

const Suggestions = () => {
  const [cvData, setCvData] = useState({ domain: '', company: '' });
  const [suggestions, setSuggestions] = useState([]);

  const handleGetSuggestions = async () => {
    const response = await fetch('http://localhost:5000/api/cv/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData),
    });
    const data = await response.json();
    setSuggestions(data.suggestions);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Get Suggestions for Your CV</h2>
      <input
        type="text"
        placeholder="Domain"
        value={cvData.domain}
        onChange={(e) => setCvData({ ...cvData, domain: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Company"
        value={cvData.company}
        onChange={(e) => setCvData({ ...cvData, company: e.target.value })}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleGetSuggestions}
        className="px-4 py-2 bg-yellow-500 text-white"
      >
        Get Suggestions
      </button>
      <ul className="mt-4">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="mb-2">
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
