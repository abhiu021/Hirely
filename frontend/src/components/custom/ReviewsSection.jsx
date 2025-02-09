import React, { useRef } from 'react';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: '★★★★★',
      review: '"Hirely made creating my resume so easy and fast. I got the job I wanted!"',
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: '★★★★★',
      review: '"The templates are beautiful and professional. Highly recommend Hirely!"',
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: '★★★★★',
      review: '"I love how easy it is to customize my resume with Hirely. Great tool!"',
    },
    {
      id: 4,
      name: 'Emily Johnson',
      rating: '★★★★★',
      review: '"The AI suggestions were spot on. My resume looks amazing now!"',
    },
    {
      id: 5,
      name: 'David Wilson',
      rating: '★★★★★',
      review: '"Hirely helped me land my dream job. I couldn’t be happier!"',
    },
    {
      id: 6,
      name: 'Sarah Davis',
      rating: '★★★★★',
      review: '"The customer support is excellent. They helped me with every step."',
    },
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
    <section className="bg-blue-50 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-12">Our Top Rated Reviews</h2>
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
            {reviews.map((review) => (
              <div key={review.id} className="flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mx-4">
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-xl mr-2">{review.rating}</span>
                  <h3 className="text-xl font-semibold">{review.name}</h3>
                </div>
                <p className="text-gray-700">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;