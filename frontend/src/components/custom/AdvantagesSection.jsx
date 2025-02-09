import React from 'react';


const AdvantagesSection = () => {
  const advantages = [
    { id: 1, title: 'Effortless Resume Creation', description: 'Create your resume quickly with pre-formatted sections and bullet points, allowing for easy customization. Save time and focus on showcasing your skills effectively.' },
    { id: 2, title: 'Showcase Your Portfolio', description: 'Transform your resume into a stunning portfolio that highlights your work and achievements. Use our tools to present your projects and skills in a visually appealing format that impresses potential employers.' },
    { id: 3, title: 'Diverse Template Options', description: 'Choose from a wide range of resume and cover letter templates to suit your personal style. Whether you prefer traditional or modern designs, we have something for everyone.' },
    { id: 4, title: 'Data Security', description: 'Your privacy is our priority; all personal information is encrypted and kept confidential. We are committed to protecting your data and never sharing it with third parties.' },
    { id: 5, title: 'HR Expert Insights', description: 'Access articles and templates reviewed by HR professionals for reliable job application advice. Benefit from expert tips to enhance your resume and interview skills.' },
    { id: 6, title: 'ATS Optimization', description: 'Our templates are designed to help your resume pass applicant tracking systems with ease. Use the right keywords and formatting to increase your chances of getting noticed.' },
  ];

  return (
    <section className="bg-blue-50 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-12">The advantages of using the <span className="font-bold text-blue-600">Hirely</span> resume builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="relative bg-white p-8 rounded-lg shadow-lg mt-8">
              <div className="absolute -top-6 -left-6 bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold">{advantage.id}</div>
              <h3 className="text-xl font-semibold mb-2 mt-6">{advantage.title}</h3>
              <p className="text-gray-700">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;