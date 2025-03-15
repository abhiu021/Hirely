import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import AnimatedSection from '../ui/animated-section';

// Sample blog content with more detailed information
export const blogPosts = [
  { 
    id: 1, 
    title: 'How to Write a Winning Resume', 
    description: 'Learn the key elements of a successful resume that will help you stand out from the competition.',
    date: 'May 15, 2023',
    author: 'Emma Roberts',
    category: 'Resume Tips',
    readTime: '7 min read',
    image: '/blog/blog1.jpg', // This would be replaced with actual images
    content: `
      <p>When it comes to job hunting, your resume is your first impression. It's your personal marketing document that showcases your skills, experience, and qualifications to potential employers.</p>
      
      <h3>Start with a Strong Summary</h3>
      <p>Begin your resume with a compelling professional summary that highlights your key strengths and career achievements. This section should be tailored to the job you're applying for and should immediately capture the recruiter's attention.</p>
      
      <h3>Showcase Relevant Experience</h3>
      <p>List your work experience in reverse chronological order, focusing on achievements rather than just responsibilities. Use action verbs and quantify your accomplishments wherever possible.</p>
      
      <h3>Highlight Key Skills</h3>
      <p>Include a dedicated skills section that highlights both your technical and soft skills. Make sure these skills align with the requirements of the job you're targeting.</p>
      
      <h3>Keep it Concise</h3>
      <p>Aim for a one-page resume, especially if you have less than 10 years of experience. Be selective about what you include and focus on the most relevant information.</p>
      
      <h3>Proofread Thoroughly</h3>
      <p>Errors on your resume can be costly. Proofread carefully for spelling, grammar, and formatting issues. Consider having someone else review it as well for an objective perspective.</p>
      
      <p>By following these guidelines, you'll create a resume that effectively showcases your qualifications and increases your chances of landing interviews.</p>
    `
  },
  { 
    id: 2, 
    title: 'Top 10 Resume Mistakes to Avoid', 
    description: 'Discover common resume mistakes that could be costing you interviews and how to fix them.',
    date: 'June 3, 2023',
    author: 'Michael Chen',
    category: 'Resume Tips',
    readTime: '5 min read',
    image: '/blog/blog2.jpg',
    content: `
      <p>Even small mistakes on your resume can significantly impact your job search. Here are the top 10 resume mistakes to avoid:</p>
      
      <h3>1. Generic Objectives</h3>
      <p>Replace vague objective statements with targeted professional summaries that highlight your specific value proposition.</p>
      
      <h3>2. Focusing on Duties Instead of Achievements</h3>
      <p>Don't just list what you were responsible for; emphasize what you accomplished and how you made a difference.</p>
      
      <h3>3. Typos and Grammatical Errors</h3>
      <p>Nothing undermines your professionalism faster than spelling mistakes and grammar errors. Proofread carefully.</p>
      
      <h3>4. Using a One-Size-Fits-All Approach</h3>
      <p>Tailor your resume for each job application to highlight the most relevant experience and skills.</p>
      
      <h3>5. Including Irrelevant Information</h3>
      <p>Focus on information that's relevant to the position you're applying for and omit details that don't add value.</p>
      
      <h3>6. Using an Unprofessional Email Address</h3>
      <p>Create a professional email address that includes your name for all job-related communications.</p>
      
      <h3>7. Including Outdated or Irrelevant Skills</h3>
      <p>Update your skills section regularly and exclude obsolete technologies or irrelevant capabilities.</p>
      
      <h3>8. Inconsistent Formatting</h3>
      <p>Maintain consistent fonts, spacing, and formatting throughout your resume for a polished look.</p>
      
      <h3>9. Including References</h3>
      <p>Save space by omitting references or the phrase "References available upon request."</p>
      
      <h3>10. Making it Too Long</h3>
      <p>Keep your resume concise and relevant. Most employers prefer one-page resumes for candidates with less than 10 years of experience.</p>
      
      <p>Avoiding these common mistakes will help your resume stand out for the right reasons and improve your chances of landing interviews.</p>
    `
  },
  { 
    id: 3, 
    title: 'Tailoring Your Resume for Different Jobs', 
    description: 'Find out why customizing your resume for each application increases your chances of success.',
    date: 'June 22, 2023',
    author: 'Sophia Martinez',
    category: 'Job Application',
    readTime: '6 min read',
    image: '/blog/blog3.jpg',
    content: `
      <p>One of the most effective job search strategies is tailoring your resume for each position you apply for. Here's why it's important and how to do it effectively:</p>
      
      <h3>Why Tailoring Your Resume Matters</h3>
      <p>Many companies use applicant tracking systems (ATS) to screen resumes before they reach human reviewers. These systems scan for specific keywords related to the job. A tailored resume with relevant keywords has a better chance of passing through these initial screenings.</p>
      
      <h3>Study the Job Description</h3>
      <p>Carefully analyze the job posting and identify key skills, qualifications, and experiences the employer is seeking. Make note of specific terms and phrases used.</p>
      
      <h3>Customize Your Professional Summary</h3>
      <p>Adjust your professional summary to highlight the skills and experiences most relevant to the specific position you're applying for.</p>
      
      <h3>Reorder and Emphasize Relevant Experience</h3>
      <p>Restructure your work experience section to highlight the most relevant positions and responsibilities. Place the most relevant experience at the top.</p>
      
      <h3>Match Your Skills Section</h3>
      <p>Update your skills section to include keywords from the job description, removing less relevant skills and adding those specifically mentioned in the posting.</p>
      
      <h3>Quantify Your Achievements</h3>
      <p>Include specific metrics and results that demonstrate your success in areas relevant to the target position.</p>
      
      <h3>Review and Refine</h3>
      <p>After tailoring your resume, review it to ensure it still flows logically and tells a coherent story about your career path.</p>
      
      <p>While customizing your resume for each application requires more effort, it significantly increases your chances of getting noticed and landing interviews.</p>
    `
  },
  { 
    id: 4, 
    title: 'Showcasing Skills on Your Resume', 
    description: 'Learn effective techniques to highlight your skills and make them stand out to potential employers.',
    date: 'July 8, 2023',
    author: 'James Wilson',
    category: 'Resume Tips',
    readTime: '4 min read',
    image: '/blog/blog4.jpg',
    content: `
      <p>Your skills are some of the most important elements of your resume. Here's how to showcase them effectively:</p>
      
      <h3>Create a Dedicated Skills Section</h3>
      <p>Include a clearly labeled skills section that's easy for recruiters to find. This can be particularly effective for technical or specialized roles.</p>
      
      <h3>Distinguish Between Skill Types</h3>
      <p>Organize your skills into categories such as technical skills, soft skills, industry-specific skills, and certifications.</p>
      
      <h3>Prioritize Relevant Skills</h3>
      <p>List the most relevant skills first, especially those mentioned in the job description or those that differentiate you from other candidates.</p>
      
      <h3>Demonstrate Skills Through Achievements</h3>
      <p>In your work experience section, show how you've applied your skills to achieve results. For example, instead of just listing "project management skills," describe how you led a team to complete a project ahead of schedule.</p>
      
      <h3>Use Skill Levels</h3>
      <p>For technical skills, consider indicating your proficiency level. This can be especially useful for language skills or software proficiencies.</p>
      
      <h3>Keep Skills Updated</h3>
      <p>Regularly review and update your skills to reflect new capabilities you've developed and to remove outdated ones.</p>
      
      <h3>Avoid Skill Stuffing</h3>
      <p>Don't include every skill you possess. Focus on quality over quantity and include skills that are relevant to the position.</p>
      
      <p>By thoughtfully presenting your skills, you make it easier for employers to identify how your capabilities align with their needs.</p>
    `
  },
  { 
    id: 5, 
    title: 'Crafting the Perfect Cover Letter', 
    description: 'Understand the key components of a compelling cover letter that complements your resume.',
    date: 'July 25, 2023',
    author: 'Olivia Johnson',
    category: 'Cover Letters',
    readTime: '5 min read',
    image: '/blog/blog5.jpg',
    content: `
      <p>A well-crafted cover letter can be the difference between getting an interview and being overlooked. Here's how to create one that gets results:</p>
      
      <h3>Start with a Strong Opening</h3>
      <p>Begin with a compelling introduction that hooks the reader and clearly states the position you're applying for and how you found it.</p>
      
      <h3>Showcase Your Understanding of the Company</h3>
      <p>Demonstrate that you've researched the company by referencing their mission, recent achievements, or projects that align with your interests and values.</p>
      
      <h3>Connect Your Experience to Their Needs</h3>
      <p>Highlight 2-3 key accomplishments or skills that directly relate to the requirements listed in the job description. Explain how your experience makes you well-suited for the specific role.</p>
      
      <h3>Address Potential Concerns</h3>
      <p>If there are gaps in your resume or you're changing careers, briefly address these points in a positive way that emphasizes your transferable skills.</p>
      
      <h3>Close with a Call to Action</h3>
      <p>End your cover letter with confidence, expressing your interest in discussing the opportunity further and your availability for an interview.</p>
      
      <h3>Keep it Concise</h3>
      <p>Limit your cover letter to one page with 3-4 paragraphs. Each paragraph should serve a specific purpose in supporting your candidacy.</p>
      
      <h3>Customize for Each Application</h3>
      <p>Avoid generic cover letters. Tailor each one to the specific company and position, using the same keywords found in the job description.</p>
      
      <p>A thoughtful cover letter shows employers that you're serious about the position and willing to put in extra effort to stand out.</p>
    `
  },
  { 
    id: 6, 
    title: 'Acing Your Job Interview', 
    description: 'Get practical tips and strategies for preparing for job interviews and making a great impression.',
    date: 'August 10, 2023',
    author: 'Daniel Park',
    category: 'Interviews',
    readTime: '8 min read',
    image: '/blog/blog6.jpg',
    content: `
      <p>The interview is your opportunity to make a lasting impression on potential employers. Here's how to prepare and perform at your best:</p>
      
      <h3>Research the Company</h3>
      <p>Thoroughly research the company's history, mission, values, products/services, competitors, and recent news. This knowledge demonstrates your genuine interest and helps you tailor your responses.</p>
      
      <h3>Study the Job Description</h3>
      <p>Analyze the job description and identify the key skills and qualifications the employer is seeking. Prepare examples from your experience that demonstrate these capabilities.</p>
      
      <h3>Practice Common Questions</h3>
      <p>Rehearse answers to standard interview questions like "Tell me about yourself," "Why do you want to work here?" and "What are your strengths and weaknesses?" Focus on being concise and relevant.</p>
      
      <h3>Prepare the STAR Method</h3>
      <p>For behavioral questions, use the STAR method (Situation, Task, Action, Result) to structure your responses and provide specific examples of your capabilities.</p>
      
      <h3>Dress Appropriately</h3>
      <p>Research the company culture and dress slightly more formally than the everyday attire. When in doubt, it's better to be overdressed than underdressed.</p>
      
      <h3>Plan Your Arrival</h3>
      <p>Plan to arrive 10-15 minutes early. If it's an in-person interview, research the location in advance and allow extra time for potential delays.</p>
      
      <h3>Prepare Thoughtful Questions</h3>
      <p>Develop insightful questions about the role, team, company culture, and growth opportunities. This shows your engagement and helps you evaluate if the position is right for you.</p>
      
      <h3>Follow Up</h3>
      <p>Send a thank-you email within 24 hours of your interview, reiterating your interest in the position and briefly addressing any points you wish you had elaborated on.</p>
      
      <p>Remember that interviews are a two-way conversation. While the company is evaluating you, you're also assessing whether the role and organization align with your career goals and values.</p>
    `
  },
  { 
    id: 7, 
    title: 'Building a Professional Online Presence', 
    description: 'Learn how to create a consistent personal brand across platforms to enhance your job search.',
    date: 'August 28, 2023',
    author: 'Rachel Kim',
    category: 'Personal Branding',
    readTime: '6 min read',
    image: '/blog/blog7.jpg',
    content: `
      <p>In today's digital world, your online presence plays a crucial role in your job search and career advancement. Here's how to build and maintain a professional online presence:</p>
      
      <h3>Optimize Your LinkedIn Profile</h3>
      <p>Start with a professional photo, compelling headline, and comprehensive summary. Complete all sections of your profile, including experience, education, skills, and accomplishments. Regularly share industry insights and engage with relevant content.</p>
      
      <h3>Clean Up Social Media</h3>
      <p>Review all your social media accounts and remove or privatize content that could be seen as unprofessional. Set appropriate privacy settings, but remember that nothing online is truly private.</p>
      
      <h3>Create a Personal Website or Portfolio</h3>
      <p>For many professions, especially creative fields, a personal website showcasing your work is invaluable. Include samples of your best work, testimonials, and your resume.</p>
      
      <h3>Contribute to Your Industry</h3>
      <p>Share your expertise by publishing articles on platforms like Medium or LinkedIn, participating in relevant online forums, or contributing to open-source projects.</p>
      
      <h3>Monitor Your Digital Footprint</h3>
      <p>Regularly Google yourself to see what information is publicly available. Set up Google Alerts for your name to stay informed about new content that mentions you.</p>
      
      <h3>Consistency Across Platforms</h3>
      <p>Maintain consistent messaging, professional photos, and branding elements across all your professional online profiles.</p>
      
      <h3>Engage Thoughtfully</h3>
      <p>When commenting or posting online, be thoughtful and constructive. Avoid controversial topics in professional spaces and focus on adding value to conversations.</p>
      
      <p>Building a strong online presence takes time, but it's a valuable investment in your professional reputation and can significantly expand your network and opportunities.</p>
    `
  }
];

const BlogCard = ({ post }) => (
  <Link to={`/blog/${post.id}`} className="block group h-full">
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-6 overflow-hidden flex items-center justify-center relative">
        <div className="text-blue-600/20 font-bold text-5xl">BLOG</div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 group-hover:opacity-0 transition-opacity duration-300"></div>
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{post.category}</span>
        <span className="text-xs text-gray-500">{post.readTime}</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 text-gray-800">{post.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
      
      <div className="flex justify-between items-center mt-auto">
        <div className="text-sm text-gray-500">{post.date}</div>
        <div className="text-sm font-medium text-gray-700">{post.author}</div>
      </div>
      
      <div className="mt-4 flex items-center text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
        Read More <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </div>
  </Link>
);

const BlogList = () => {
  return (
    <div className="py-20 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-60 right-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection animation="fade-up" delay={100}>
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
            Career Insights & Tips
          </h1>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay={200}>
          <p className="text-gray-600 max-w-3xl mx-auto text-center text-lg mb-16">
            Explore our collection of expert articles and resources to help you navigate your career path, craft winning resumes, and land your dream job
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <AnimatedSection 
              key={post.id} 
              animation="fade-up" 
              delay={300 + index * 100}
            >
              <BlogCard post={post} />
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection animation="fade-up" delay={900} className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-md">
            <Button variant="outline" className="rounded-full text-gray-500 hover:text-blue-600 px-4">
              Previous
            </Button>
            <div className="h-6 w-px bg-gray-200"></div>
            <Button variant="ghost" className="bg-blue-50 text-blue-600 rounded-full w-9 h-9 p-0">1</Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 rounded-full w-9 h-9 p-0">2</Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 rounded-full w-9 h-9 p-0">3</Button>
            <div className="h-6 w-px bg-gray-200"></div>
            <Button variant="outline" className="rounded-full text-gray-700 hover:text-blue-600 px-4">
              Next
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BlogList; 