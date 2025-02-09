import React from 'react';

const StepsSection = () => {
  return (
    <section className="bg-blue-50 py-16 relative overflow-hidden">
      {/* Adjusted Circles */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full opacity-50 transform -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full opacity-50 transform translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto text-center relative z-10 px-4">
        <h2 className="text-3xl font-bold mb-12">
          Create your resume in 3 easy steps now with AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="relative bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold">
                {step}
              </div>

              {/* Step Content */}
              <h3 className="text-xl font-semibold mb-4 mt-6">
                {step === 1 && 'Fill in Your Details'}
                {step === 2 && 'Choose a Template'}
                {step === 3 && 'Download Your Resume'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {step === 1 && 'Enter your personal information, work experience, and skills.'}
                {step === 2 && 'Select from a variety of professional templates to get started.'}
                {step === 3 && 'Save your resume in PDF format and start applying for jobs.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;