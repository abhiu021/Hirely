import React from 'react';

const ResumeBuilderSection = () => {
  return (
    <section className="bg-white py-16 relative font-open-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-4">Create Your Perfect Resume with Ease</h2>
        <p className="text-sm text-gray-700 max-w-2xl mx-auto mb-4">Use our intuitive resume builder to craft the perfect application document in just minutes. With a wide range of customizable templates available, you’re guaranteed to create a standout resume that effectively showcases your skills and experience.</p>
        <p className="text-sm text-gray-700 max-w-2xl mx-auto mb-12">Explore our extensive library of free resume examples for inspiration. Start building your impressive resume today and take the first step toward your next career opportunity!</p>
        <div className="relative flex justify-center items-center overflow-hidden">
          {[1, 2, 3, 4].map((template) => (
            <img
              key={template}
              src={`https://storage.googleapis.com/a1aa/image/template${template}.jpg`}
              alt={`Template ${template}`}
              className="w-48 h-64 rounded-lg shadow-lg transform -rotate-6"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilderSection;