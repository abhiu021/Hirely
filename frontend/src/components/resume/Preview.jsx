import React from 'react';

const Preview = ({ resumeData }) => {
  return (
    <div className="w-96 bg-white border-l p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <button className="text-blue-600 hover:text-blue-700">
          Download PDF
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {/* Preview content based on resumeData */}
      </div>
    </div>
  );
};

export default Preview;