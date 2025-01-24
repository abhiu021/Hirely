import React, { useState } from 'react';

const UpdateCV = () => {
  const [cvId, setCvId] = useState('');
  const [updateData, setUpdateData] = useState({
    domain: '',
    company: '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/cv/update/${cvId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    console.log('Updated CV:', data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Update Existing CV</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="CV ID"
          value={cvId}
          onChange={(e) => setCvId(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Domain"
          value={updateData.domain}
          onChange={(e) => setUpdateData({ ...updateData, domain: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Company"
          value={updateData.company}
          onChange={(e) => setUpdateData({ ...updateData, company: e.target.value })}
          className="border p-2 w-full"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateCV;
