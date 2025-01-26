import React from 'react';

const TemplateGallery = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Resume Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src={template.preview} alt={template.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-gray-600">{template.description}</p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const templates = [
  {
    id: 1,
    name: "Professional",
    description: "Clean and modern template for corporate jobs",
    preview: "/templates/professional.png"
  },
  // Add more templates...
];

export default TemplateGallery;