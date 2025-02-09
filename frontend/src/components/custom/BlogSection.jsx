import React, { useRef } from 'react';

const BlogSection = () => {
  const blogPosts = [
    { id: 1, title: 'How to Write a Winning Resume', description: 'Learn the key elements of a successful resume and how to make yours stand out from the competition.' },
    { id: 2, title: 'Top 10 Resume Mistakes to Avoid', description: 'Discover the most common resume mistakes and how to avoid them to increase your chances of landing an interview.' },
    { id: 3, title: 'The Importance of Tailoring Your Resume', description: 'Find out why it\'s crucial to customize your resume for each job application and how to do it effectively.' },
    { id: 4, title: 'How to Showcase Your Skills on Your Resume', description: 'Learn the best ways to highlight your skills and make them stand out to potential employers.' },
    { id: 5, title: 'Crafting the Perfect Cover Letter', description: 'Understand the key components of a compelling cover letter and how to write one that complements your resume.' },
    { id: 6, title: 'How to Ace Your Job Interview', description: 'Get tips and strategies for preparing for job interviews and making a great impression on potential employers.' },
    { id: 7, title: 'Building a Professional Online Presence', description: 'Learn how to create and maintain a professional online presence that enhances your job search efforts.' },
  ];

  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-16 relative font-open-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-12">Our Blog</h2>
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20 hover:bg-gray-100 transition-colors duration-300"
          >
            &larr;
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20 hover:bg-gray-100 transition-colors duration-300"
          >
            &rarr;
          </button>
          <div ref={containerRef} className="flex overflow-x-auto scrollbar-hide pb-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mx-4">
                <h3 className="text-xl font-semibold mb-4">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.description}</p>
                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-300">
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;