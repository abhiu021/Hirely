import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import AnimatedSection from '../ui/animated-section';

// Simplified blog posts data
export const blogPosts = [
  { 
    id: 1, 
    title: "How to Create a Professional Resume",
    description: "Learn the essential steps to craft a standout resume that gets noticed by recruiters.",
    date: "June 15, 2023",
    author: "Sarah Johnson",
    category: "Resume Tips",
    readTime: "5 min read",
    content: `
      <h2>Creating a Professional Resume</h2>
      <p>Your resume is often the first impression you make on a potential employer. Here are some key tips to help you create a professional resume:</p>
      
      <h3>Choose the Right Format</h3>
      <p>Select a clean, professional format that best showcases your experience. Chronological formats work well for those with steady career progression, while functional formats can highlight skills over employment gaps.</p>
      
      <h3>Include Essential Sections</h3>
      <p>Make sure your resume includes the following key sections:</p>
      <ul>
        <li>Contact information</li>
        <li>Professional summary or objective</li>
        <li>Work experience</li>
        <li>Education</li>
        <li>Skills</li>
      </ul>
      
      <h3>Be Concise and Relevant</h3>
      <p>Keep your resume concise, ideally 1-2 pages. Focus on relevant experience and achievements that align with the job you're applying for.</p>
      
      <h3>Use Action Verbs</h3>
      <p>Start bullet points with strong action verbs like "managed," "created," or "implemented" to emphasize your accomplishments.</p>
      
      <h3>Proofread Carefully</h3>
      <p>Errors on your resume can give a negative impression. Always proofread thoroughly before submitting.</p>
    `
  },
  { 
    id: 2, 
    title: "Top 5 Resume Mistakes to Avoid",
    description: "Don't let these common resume errors cost you job opportunities.",
    date: "May 28, 2023",
    author: "David Chen",
    category: "Resume Tips",
    readTime: "4 min read",
    content: `
      <h2>Resume Mistakes to Avoid</h2>
      <p>Even the most qualified candidates can be overlooked due to simple resume mistakes. Here are five common errors to avoid:</p>
      
      <h3>1. Generic Content</h3>
      <p>Tailoring your resume for each job application is crucial. Generic resumes that aren't customized to the specific role often end up in the rejection pile.</p>
      
      <h3>2. Poor Formatting</h3>
      <p>Inconsistent formatting, hard-to-read fonts, or cluttered layouts can make your resume difficult to read. Use a clean, professional design with consistent spacing and formatting.</p>
      
      <h3>3. Typos and Grammatical Errors</h3>
      <p>Spelling mistakes and grammatical errors suggest carelessness and lack of attention to detail—qualities no employer wants.</p>
      
      <h3>4. Focusing on Duties Instead of Achievements</h3>
      <p>Simply listing job responsibilities doesn't showcase your value. Focus on specific accomplishments and how you made a positive impact in previous roles.</p>
      
      <h3>5. Including Irrelevant Information</h3>
      <p>Outdated or irrelevant experience can distract from your qualifications. Keep your resume focused on information relevant to the position you're applying for.</p>
    `
  },
  { 
    id: 3, 
    title: "How to Write a Cover Letter That Gets Results",
    description: "Craft a compelling cover letter to complement your resume and boost your job search success.",
    date: "May 10, 2023",
    author: "Emily Rodriguez",
    category: "Cover Letters",
    readTime: "6 min read",
    content: `
      <h2>Writing an Effective Cover Letter</h2>
      <p>A well-written cover letter can significantly increase your chances of landing an interview. Here's how to write one that gets results:</p>
      
      <h3>Address it Properly</h3>
      <p>When possible, address your cover letter to a specific person rather than using a generic greeting. Research the company to find the hiring manager's name.</p>
      
      <h3>Customize for Each Application</h3>
      <p>Like your resume, your cover letter should be tailored for each position. Reference the specific job and company to show your genuine interest.</p>
      
      <h3>Open with a Strong Hook</h3>
      <p>Begin with an engaging opening paragraph that captures attention and conveys your enthusiasm for the role.</p>
      
      <h3>Highlight Relevant Achievements</h3>
      <p>In the body, focus on 2-3 key accomplishments that demonstrate your qualifications. Use specific examples that relate to the job requirements.</p>
      
      <h3>Close with a Call to Action</h3>
      <p>End your cover letter by expressing interest in an interview and indicating how and when you'll follow up.</p>
      
      <h3>Keep it Concise</h3>
      <p>A cover letter should be no longer than one page. Be brief but impactful with your message.</p>
    `
  },
  {
    id: 4,
    title: "Mastering the Job Interview: Preparation Tips",
    description: "Prepare effectively for your next job interview with these expert strategies.",
    date: "April 22, 2023",
    author: "Michael Thompson",
    category: "Interviews",
    readTime: "7 min read",
    content: `
      <h2>Job Interview Preparation</h2>
      <p>Proper preparation is the key to interview success. Follow these tips to make a strong impression:</p>
      
      <h3>Research the Company</h3>
      <p>Thoroughly research the company's products, services, culture, and recent news. This knowledge demonstrates your interest and helps you tailor your responses.</p>
      
      <h3>Prepare for Common Questions</h3>
      <p>Practice answers to frequently asked interview questions, including:</p>
      <ul>
        <li>"Tell me about yourself"</li>
        <li>"Why do you want to work here?"</li>
        <li>"What are your strengths and weaknesses?"</li>
        <li>"Where do you see yourself in five years?"</li>
      </ul>
      
      <h3>Use the STAR Method</h3>
      <p>For behavioral questions, structure your answers using the STAR method: Situation, Task, Action, and Result.</p>
      
      <h3>Prepare Questions to Ask</h3>
      <p>Have thoughtful questions ready to ask the interviewer about the role, team, and company.</p>
      
      <h3>Practice Your Delivery</h3>
      <p>Conduct mock interviews with a friend or in front of a mirror to practice your responses and body language.</p>
    `
  },
  {
    id: 5,
    title: "Effective Networking Strategies for Job Seekers",
    description: "Learn how to build and leverage professional relationships in your job search.",
    date: "April 5, 2023",
    author: "Jennifer Lee",
    category: "Job Application",
    readTime: "5 min read",
    content: `
      <h2>Networking for Job Success</h2>
      <p>Networking is one of the most effective ways to discover job opportunities. Here are strategies to expand and utilize your professional network:</p>
      
      <h3>Start with Who You Know</h3>
      <p>Begin networking with existing contacts—friends, family, former colleagues, and classmates. They may know of opportunities or can introduce you to others in your field.</p>
      
      <h3>Utilize LinkedIn Effectively</h3>
      <p>Maintain an updated LinkedIn profile and actively engage with industry content. Join relevant groups and connect with professionals in your target field.</p>
      
      <h3>Attend Industry Events</h3>
      <p>Participate in conferences, workshops, and networking events related to your industry. These provide opportunities to meet new contacts and learn about job openings.</p>
      
      <h3>Conduct Informational Interviews</h3>
      <p>Request informational interviews with professionals in roles or companies that interest you. These conversations provide valuable insights and can lead to referrals.</p>
      
      <h3>Follow Up and Maintain Relationships</h3>
      <p>After making a connection, follow up with a thank-you note or email. Regularly check in with your network to maintain relationships.</p>
    `
  }
];

const BlogList = () => {
  return (
    <div className="py-16 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-60 right-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              Our Blog
          </h1>
            <p className="text-lg text-gray-600">
              Explore our latest articles with expert advice on resume building, job applications, and career development.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <AnimatedSection 
              key={post.id} 
              animation="fade-up" 
              delay={100 + index * 50}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                  <div className="text-blue-600/20 font-bold text-6xl">BLOG</div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-blue-600" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1 text-blue-600" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-blue-600" />
                      {post.readTime}
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-5 line-clamp-3">
                    {post.description}
                  </p>
                  
                  <Link to={`/blog/${post.id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full text-sm">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList; 