import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import 'dotenv/config';
import fetch from 'node-fetch';
import mongoose from 'mongoose';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Helper function to parse plain text response
const parsePlainTextResponse = (text) => {
  try {
    // Try to extract a JSON object from the text
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      const jsonString = text.slice(jsonStartIndex, jsonEndIndex + 1);
      return JSON.parse(jsonString);
    }
    
    // If no JSON found, fall back to basic parsing
    return parseResumeTextToStructured(text);
  } catch (error) {
    console.error('Error parsing plain text response:', error);
    return parseResumeTextToStructured(text);
  }
};

/**
 * Parse resume text using Hugging Face's Inference API.
 * @param {string} text - The extracted text from the resume.
 * @returns {Object} - Parsed resume data.
 */
export const parseResumeWithAI = async (text) => {
  const truncatedText = text.slice(0, 3000); // Truncate text to reduce token count

  const prompt = `
    Extract the following details from the resume and return the response in valid JSON format:
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "jobTitle": "Software Engineer",
      "address": "123 Main St, City, State, ZIP",
      "skills": [
        { "name": "JavaScript", "rating": 5 },
        { "name": "React", "rating": 4 }
      ],
      "education": [
        {
          "universityName": "XYZ University",
          "degree": "Bachelor of Science",
          "major": "Computer Science",
          "startDate": "2016-08-01",
          "endDate": "2020-05-01",
          "description": "Graduated with honors"
        }
      ],
      "experience": [
        {
          "title": "Software Engineer",
          "companyName": "ABC Corp",
          "city": "San Francisco",
          "state": "CA",
          "startDate": "2020-06-01",
          "endDate": "Present",
          "workSummary": "Developed web applications using React and Node.js"
        }
      ],
      "projects": [
        {
          "name": "Project 1",
          "description": "A web application for task management",
          "technologies": "React, Node.js, MongoDB",
          "link": "https://example.com/project1",
          "isVerified": true
        }
      ],
      "summary": "Experienced software engineer with expertise in web development.",
      "themeColor": "#3498db"
    }

    Resume Text: ${truncatedText}
  `;

  const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        const rawResponse = await response.text();

        console.log('Raw API Response:', rawResponse); // Log the raw response

        // Check if the response is empty or too short
        if (!rawResponse || rawResponse.length < 10) {
          throw new Error('API response is empty or too short');
        }

        // Check if the response is an HTML error page
        if (rawResponse.startsWith('<!DOCTYPE html>')) {
          throw new Error('API returned an HTML error page');
        }

        // Attempt to parse the response as JSON
        let data;
        try {
          data = JSON.parse(rawResponse);
        } catch (error) {
          // If JSON parsing fails, parse the plain text response
          console.log('Parsing plain text response...');
          return parsePlainTextResponse(rawResponse);
        }

        // Handle model loading errors
        if (data.error) {
          if (data.error.includes('loading')) {
            console.log('Model is loading. Retrying in 10 seconds...');
            await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
            continue; // Retry the request
          } else {
            throw new Error(`API Error: ${data.error}`);
          }
        }

        // Extract the generated text
        const generatedText = data[0]?.generated_text || data[0]?.summary || data[0]?.text;
        if (!generatedText) {
          throw new Error('No generated text found in the API response');
        }

        // Clean the response to extract only the JSON part
        const jsonStartIndex = generatedText.indexOf('{');
        const jsonEndIndex = generatedText.lastIndexOf('}');
        const jsonString = generatedText.slice(jsonStartIndex, jsonEndIndex + 1);

        return JSON.parse(jsonString);
      } catch (error) {
        if (i < retries - 1) {
          console.log(`Retrying in 10 seconds... (Attempt ${i + 1}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
        } else {
          throw error;
        }
      }
    }
  };

  try {
    const data = await fetchWithRetry(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250, // Adjusted to the allowed limit
          },
        }),
      }
    );

    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    
    // Fallback to basic parsing if AI parsing fails
    console.log('Falling back to basic resume parsing...');
    return parseResumeTextToStructured(text);
  }
};

/**
 * Extracts text from a PDF file buffer.
 * @param {Buffer} fileBuffer - The PDF file buffer.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPdf = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer, {
      // Setting these options improves extraction quality
      pagerender: render_page,
      max: 0, // Maximum pages (0 means all pages)
    });

    // Check if text was extracted
    if (!data.text) {
      throw new Error('No text found in the PDF file.');
    }

    // Process and clean the extracted text
    const cleanedText = cleanExtractedText(data.text);
    return cleanedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error.message);
    throw new Error('Failed to extract text from PDF. Please ensure the file is valid.');
  }
};

// Custom page renderer to handle text extraction better
function render_page(pageData) {
  let renderOptions = {
    normalizeWhitespace: true,
    disableCombineTextItems: false
  };
  
  return pageData.getTextContent(renderOptions)
    .then(function(textContent) {
      let lastY, text = '';
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str;
        } else {
          text += '\n' + item.str;
        }
        lastY = item.transform[5];
      }
      return text;
    });
}

// Function to clean and normalize extracted text
function cleanExtractedText(text) {
  // Replace multiple spaces with a single space
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Replace multiple newlines with a single newline
  cleaned = cleaned.replace(/\n+/g, '\n');
  
  // Remove non-printable characters
  cleaned = cleaned.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim leading/trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Extracts text from a DOCX file buffer.
 * @param {Buffer} fileBuffer - The DOCX file buffer.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromDocx = async (fileBuffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });

    // Check if text was extracted
    if (!result.value) {
      throw new Error('No text found in the DOCX file.');
    }

    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error.message);
    throw new Error('Failed to extract text from DOCX. Please ensure the file is valid.');
  }
};

/**
 * Maps parsed resume data to a schema.
 * @param {Object} parsedData - The parsed resume data.
 * @returns {Object} - Mapped resume data.
 */
export const mapParsedDataToSchema = (parsedData) => {
  try {
    // Create resume ID safely
    let resumeId;
    try {
      resumeId = new mongoose.Types.ObjectId().toString();
    } catch (error) {
      console.error('Error creating mongoose ObjectId:', error);
      resumeId = Date.now().toString(); // Fallback to timestamp
    }
    
  return {
    title: parsedData.name || 'Untitled Resume',
      resumeId: resumeId,
    userEmail: parsedData.email || '',
    userName: parsedData.name || '',
    personalDetails: {
      firstName: parsedData.name?.split(' ')[0] || '',
      lastName: parsedData.name?.split(' ')[1] || '',
      jobTitle: parsedData.jobTitle || '',
      address: parsedData.address || '',
      phone: parsedData.phone || '',
      email: parsedData.email || '',
    },
    education: parsedData.education || [],
    Experience: parsedData.experience || [],
    skills: parsedData.skills || [],
    projects: parsedData.projects || [],
    summery: parsedData.summary || '',
    themeColor: parsedData.themeColor || '#3498db',
  };
  } catch (error) {
    console.error('Error mapping parsed data to schema:', error);
    
    // Return a minimal valid schema
    return {
      title: 'Untitled Resume',
      resumeId: Date.now().toString(),
      userEmail: '',
      userName: '',
      personalDetails: {
        firstName: '',
        lastName: '',
        jobTitle: '',
        address: '',
        phone: '',
        email: '',
      },
      education: [],
      Experience: [],
      skills: [],
      projects: [],
      summery: 'Resume details could not be automatically extracted. Please edit manually.',
      themeColor: '#3498db',
    };
  }
};

/**
 * Parses the extracted text to extract key fields.
 * @param {string} text - The extracted text from the resume.
 * @returns {Object} - An object containing parsed fields (name, email, phone, skills, education).
 */
export const parseResumeText = (text) => {
  try {
    // Extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const email = text.match(emailRegex)?.[0] || '';

    // Extract phone number (supports international formats)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const phone = text.match(phoneRegex)?.[0] || '';

    // Extract name (assumes the first line with a capitalized name pattern is the name)
    const nameRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/;
    const nameMatch = text.match(nameRegex);
    const name = nameMatch ? nameMatch[0] : '';

    // Extract skills (example: looks for a "Skills" section)
    const skillsRegex = /Skills:\s*([\s\S]*?)(?:\n\n|$)/i;
    const skillsMatch = text.match(skillsRegex);
    const skills = skillsMatch ? skillsMatch[1].trim().split(/\s*,\s*|\n/) : [];

    // Extract education (example: looks for an "Education" section)
    const educationRegex = /Education:\s*([\s\S]*?)(?:\n\n|$)/i;
    const educationMatch = text.match(educationRegex);
    const education = educationMatch ? educationMatch[1].trim().split('\n') : [];

    return {
      name,
      email,
      phone,
      skills,
      education,
    };
  } catch (error) {
    console.error('Error parsing resume text:', error.message);
    
    // Return a minimal structure instead of throwing
    return {
      name: '',
      email: '',
      phone: '',
      skills: [],
      education: [],
    };
  }
};

/**
 * Parse resume text to a structured format as a fallback when AI parsing fails.
 * @param {string} text - The extracted text from the resume.
 * @returns {Object} - An object containing parsed fields structured like the AI response.
 */
export const parseResumeTextToStructured = (text) => {
  try {
    // Extract email with a more comprehensive regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;
    const emailMatches = text.match(emailRegex) || [];
    const email = emailMatches.length > 0 ? emailMatches[0] : '';

    // Extract phone numbers with an improved regex
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/g;
    const phoneMatches = text.match(phoneRegex) || [];
    const phone = phoneMatches.length > 0 ? phoneMatches[0] : '';

    // Extract LinkedIn profile
    const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin:)([a-zA-Z0-9-]+)/i;
    const linkedinMatch = text.match(linkedinRegex);
    const linkedin = linkedinMatch ? linkedinMatch[0] : '';

    // Extract name - look at the beginning of the resume with more patterns
    let name = '';
    const nameLines = text.split('\n').slice(0, 5); // Check first 5 lines for name
    const namePatterns = [
      /^([A-Z][a-z]+(?: [A-Z][a-z]+){1,2})$/,  // Typical Name Format
      /^([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)$/,   // With middle initial
      /^([A-Z][A-Z]+,? [A-Z][a-z]+)$/          // Last name first format
    ];
    
    for (const line of nameLines) {
      for (const pattern of namePatterns) {
        const match = line.trim().match(pattern);
        if (match) {
          name = match[1];
          break;
        }
      }
      if (name) break;
    }
    
    // More comprehensive address extraction
    const addressRegex = /(\d+\s+[A-Za-z\s]+,\s+[A-Za-z\s]+,\s+[A-Z]{2}\s+\d{5}(-\d{4})?)/i;
    const addressMatch = text.match(addressRegex);
    const address = addressMatch ? addressMatch[1] : '';

    // Better job title extraction
    const jobTitlePatterns = [
      /\n([A-Za-z\s]+(?:Engineer|Developer|Designer|Manager|Specialist|Analyst|Consultant|Director|Architect|Executive|Officer|Administrator|Lead|Head|Chief))\n/i,
      /\n(Senior|Junior|Staff|Principal)?\s?([A-Za-z\s]+(?:Engineer|Developer|Designer|Manager|Specialist|Analyst|Consultant|Director|Architect))\n/i,
      /\n((?:Front|Back|Full)[- ]End[A-Za-z\s]+)\n/i,
      /\n((?:UI|UX|CX|Product|Project|Program)[A-Za-z\s]+)\n/i
    ];
    
    let jobTitle = '';
    for (const pattern of jobTitlePatterns) {
      const match = text.match(pattern);
      if (match) {
        jobTitle = match[1].trim();
        break;
      }
    }

    // Extract skills with a more sophisticated approach
    let skills = [];
    // Try multiple patterns for skills sections
    const skillsPatterns = [
      /Skills(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i,
      /Technical Skills(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i,
      /Proficiencies(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i,
      /Expertise(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i,
      /Technologies(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i
    ];
    
    for (const pattern of skillsPatterns) {
      const skillsMatch = text.match(pattern);
      if (skillsMatch && skillsMatch[1]) {
        // Split skills by commas, semicolons, or new lines and clean them up
        const skillsList = skillsMatch[1].trim()
          .split(/\s*[,;|•]\s*|\n/)
          .filter(skill => skill.trim().length > 0 && skill.trim().length < 50) // Avoid too long strings
          .map(skill => skill.trim());
          
        // Assign ratings based on position in the list (first skills often more important)
        skills = skillsList.map((skill, index) => {
          const priority = Math.max(5 - Math.floor(index / 3), 3); // Higher skills get higher ratings
          return { name: skill, rating: priority };
        });
        
        if (skills.length > 0) break; // Stop if we found skills
      }
    }
    
    // If we didn't find a dedicated skills section, try to extract skills using common tech keywords
    if (skills.length === 0) {
      const techKeywords = [
        'JavaScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'React', 'Angular', 'Vue', 'Node', 'Express',
        'Django', 'Flask', 'Spring', 'Ruby', 'Rails', 'PHP', 'Laravel', 'SQL', 'MySQL', 'PostgreSQL',
        'MongoDB', 'NoSQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS',
        'TypeScript', 'Redux', 'REST', 'GraphQL', 'SASS', 'LESS', 'WordPress', 'Shopify', 'Linux',
        'Windows', 'macOS', 'Agile', 'Scrum', 'Jira', 'Confluence', 'CI/CD', 'Jenkins', 'TDD'
      ];
      
      const techRegex = new RegExp(`\\b(${techKeywords.join('|')})\\b`, 'gi');
      const matches = [...text.matchAll(techRegex)];
      const uniqueMatches = [...new Set(matches.map(m => m[0]))];
      
      skills = uniqueMatches.map(skill => ({ name: skill, rating: 3 }));
    }
    
    // More comprehensive education extraction
    const educationPatterns = [
      /Education(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i,
      /Academic Background(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i,
      /Qualifications(?::|)([\s\S]*?)(?:(?:\n\s*\n)|\n[A-Z]|$)/i
    ];
    
    let education = [];
    let educationText = '';
    
    for (const pattern of educationPatterns) {
      const educationMatch = text.match(pattern);
      if (educationMatch && educationMatch[1]) {
        educationText = educationMatch[1].trim();
        break;
      }
    }
    
    if (educationText) {
      // Split into potential education entries - looking for institution names or degree types
      const lines = educationText.split('\n');
      let currentEntry = '';
      let entries = [];
      
      for (const line of lines) {
        if (line.match(/University|College|Institute|School|Bachelor|Master|MBA|Ph\.D|B\.S|M\.S|B\.A|M\.A/i)) {
          if (currentEntry) entries.push(currentEntry);
          currentEntry = line;
        } else if (currentEntry && line.trim()) {
          currentEntry += '\n' + line;
        }
      }
      
      if (currentEntry) entries.push(currentEntry);
      
      // Process each education entry
      education = entries.map(entry => {
        // Extract university name
        const universityMatch = entry.match(/([A-Za-z\s&',]+(?:University|College|Institute|School|Academy))/i);
        const universityName = universityMatch ? universityMatch[0].trim() : '';
        
        // Extract degree with more patterns
        const degreePatterns = [
          /(Bachelor|Master|Ph\.D|B\.S\.|M\.S\.|B\.A\.|M\.A\.|MBA|Diploma)[^\n]*/i,
          /(Associate's|Bachelor's|Master's|Doctoral)[^\n]*/i,
          /(BS|MS|BA|MA|PhD|MD|JD)[^\n]*/i
        ];
        
        let degree = '';
        for (const pattern of degreePatterns) {
          const match = entry.match(pattern);
          if (match) {
            degree = match[0].trim();
            break;
          }
        }
        
        // Extract major/field of study
        const majorMatch = entry.match(/(?:in|of)\s([A-Za-z\s&',]+)(?:,|\n|$)/i) || 
                          entry.match(/([A-Za-z\s&',]+(?:Engineering|Science|Arts|Business|Administration|Management))/i);
        const major = majorMatch ? majorMatch[1].trim() : '';
        
        // More comprehensive date extraction
        const datePatterns = [
          /(\d{4})\s*[-–—to]+\s*(\d{4}|Present|Current)/i,
          /(\d{4})\s*[-–—]+\s*(\d{2}|\d{4}|Present|Current)/i,
          /(?:From|Since)\s+(\d{4})(?:\s+to\s+(\d{4}|Present|Current))?/i,
          /(?:Graduated|Completed)(?:[:\s]+)(\d{4})/i
        ];
        
        let startDate = '';
        let endDate = '';
        
        for (const pattern of datePatterns) {
          const match = entry.match(pattern);
          if (match) {
            startDate = match[1] ? `${match[1]}-01-01` : '';
            endDate = match[2] ? (match[2].match(/Present|Current/i) ? 'Present' : `${match[2].length === 2 ? '20' + match[2] : match[2]}-01-01`) : '';
            break;
          }
        }
        
        // If we found just one date and no explicit indication it's a graduation date, assume it's the end date
        if (!startDate && !endDate) {
          const singleYearMatch = entry.match(/\b((?:19|20)\d{2})\b/);
          if (singleYearMatch) {
            endDate = `${singleYearMatch[1]}-01-01`;
          }
        }
        
        // Extract description/achievements
        let description = '';
        const descLines = entry.split('\n').slice(1); // Skip the first line which likely has the institution
        if (descLines.length > 0) {
          description = descLines.filter(line => 
            !line.match(/Bachelor|Master|Ph\.D|MBA|Diploma|GPA|grade/i) && 
            !line.match(/\d{4}/) && 
            line.trim().length > 0
          ).join(' ');
        }
        
        return {
          universityName,
          degree,
          major,
          startDate,
          endDate,
          description
        };
      }).filter(edu => edu.universityName || edu.degree); // Keep only entries with at least institution or degree
    }
    
    // Enhanced experience extraction
    const experiencePatterns = [
      /(?:Experience|Work Experience|Employment|Professional Experience|Career)(?::|)([\s\S]*?)(?:(?:\n\s*\n\s*[A-Z])|\n[A-Z][a-z]+:|\n\s*Education|$)/i,
      /(?:Work History)(?::|)([\s\S]*?)(?:(?:\n\s*\n\s*[A-Z])|\n[A-Z][a-z]+:|\n\s*Education|$)/i
    ];
    
    let experience = [];
    let experienceText = '';
    
    for (const pattern of experiencePatterns) {
      const experienceMatch = text.match(pattern);
      if (experienceMatch && experienceMatch[1]) {
        experienceText = experienceMatch[1].trim();
        break;
      }
    }
    
    if (experienceText) {
      // First, try to identify individual entries by looking for company names or job titles
      const lines = experienceText.split('\n');
      let currentEntry = '';
      let entries = [];
      
      // Company or position indicators
      const entryStartPattern = /(?:^|\n)(?:[A-Z][a-zA-Z\s&.',]+(?:Inc\.|LLC|Ltd\.?|Corp\.?|Corporation|Company|Group|Solutions))|(?:[A-Z][a-z]+\s+[A-Z][a-z]+,?\s+[A-Z][a-z]+)/;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Check if this line looks like the start of a new entry
        if (
          line.match(entryStartPattern) || 
          line.match(/^[A-Z][a-zA-Z\s&.',]+$/) || // All capitalized words
          line.match(/(?:Senior|Junior|Lead|Principal|Staff)\s+[A-Za-z\s]+(?:Engineer|Developer|Designer|Manager|Specialist|Analyst|Consultant|Director|Architect)/) ||
          (i > 0 && line.match(/\d{4}\s*[-–—to]+\s*(?:\d{4}|Present|Current)/i))
        ) {
          if (currentEntry) entries.push(currentEntry);
          currentEntry = line;
        } else if (currentEntry) {
          currentEntry += '\n' + line;
        }
      }
      
      if (currentEntry) entries.push(currentEntry);
      
      // If we couldn't identify clear entries, try a more aggressive approach
      if (entries.length === 0) {
        // Look for date patterns as entry separators
        const datePattern = /\b(?:(?:19|20)\d{2})\s*[-–—to]+\s*(?:(?:19|20)\d{2}|Present|Current)\b/i;
        currentEntry = '';
        
        for (const line of lines) {
          if (line.match(datePattern) && currentEntry) {
            entries.push(currentEntry);
            currentEntry = line;
          } else if (line.trim()) {
            currentEntry += (currentEntry ? '\n' : '') + line;
          }
        }
        
        if (currentEntry) entries.push(currentEntry);
      }
      
      // Process each experience entry
      experience = entries.map(entry => {
        // Extract company name with more patterns
        const companyPatterns = [
          /([A-Za-z\s&.',]+(?:Inc\.|LLC|Ltd\.?|Corp\.?|Corporation|Company|Group|Solutions))/i,
          /^([A-Z][a-zA-Z\s&.',]+)(?:,|\s+[A-Z][a-z]+)/m,
          /(?:at|with|for)\s+([A-Z][a-zA-Z\s&.',]+)(?:,|\s+in|\s+as|\n|$)/i
        ];
        
        let companyName = '';
        for (const pattern of companyPatterns) {
          const match = entry.match(pattern);
          if (match) {
            companyName = match[1].replace(/,$/, '').trim();
            break;
          }
        }
        
        // Extract title with more patterns
        const titlePatterns = [
          /(?:^|\n)([A-Za-z\s]+(?:Engineer|Developer|Designer|Manager|Specialist|Analyst|Consultant|Director|Architect|Coordinator|Representative|Associate|Assistant))/i,
          /(?:as|position:)\s+([A-Za-z\s]+(?:Engineer|Developer|Designer|Manager|Specialist|Analyst|Consultant|Director|Architect))/i,
          /(?:^|\n)((?:Senior|Junior|Lead|Principal|Staff)\s+[A-Za-z\s]+)/i,
          /(?:^|\n)((?:Front|Back|Full)[- ]End[A-Za-z\s]+)/i
        ];
        
        let title = '';
        for (const pattern of titlePatterns) {
          const match = entry.match(pattern);
          if (match) {
            title = match[1].trim();
            break;
          }
        }
        
        // More comprehensive date extraction
        const datePatterns = [
          /(\d{4})\s*[-–—to]+\s*(\d{4}|Present|Current)/i,
          /(\d{2}\/\d{4})\s*[-–—to]+\s*(\d{2}\/\d{4}|Present|Current)/i,
          /(?:From|Since)\s+(\d{4})(?:\s+to\s+(\d{4}|Present|Current))?/i,
          /(\w+ \d{4})\s*[-–—to]+\s*(\w+ \d{4}|Present|Current)/i
        ];
        
        let startDate = '';
        let endDate = '';
        
        for (const pattern of datePatterns) {
          const match = entry.match(pattern);
          if (match) {
            // Convert MM/YYYY to YYYY-MM-01
            if (match[1] && match[1].includes('/')) {
              const [month, year] = match[1].split('/');
              startDate = `${year}-${month.padStart(2, '0')}-01`;
            } else {
              startDate = match[1] ? `${match[1].match(/\d{4}/)[0]}-01-01` : '';
            }
            
            if (match[2] && match[2].match(/Present|Current/i)) {
              endDate = 'Present';
            } else if (match[2] && match[2].includes('/')) {
              const [month, year] = match[2].split('/');
              endDate = `${year}-${month.padStart(2, '0')}-01`;
            } else if (match[2]) {
              endDate = `${match[2].match(/\d{4}/)[0]}-01-01`;
            }
            break;
          }
        }
        
        // Extract location
        const locationPatterns = [
          /([A-Za-z\s]+),\s*([A-Z]{2})/,
          /([A-Za-z\s]+),\s*([A-Za-z\s]+)/,
          /Location:\s*([A-Za-z\s,]+)/i
        ];
        
        let city = '';
        let state = '';
        
        for (const pattern of locationPatterns) {
          const match = entry.match(pattern);
          if (match) {
            city = match[1].trim();
            state = match[2] ? match[2].trim() : '';
            break;
          }
        }
        
        // Extract work summary - eliminate the first line (usually company/title) and dates
        let workSummary = entry;
        if (companyName) {
          workSummary = workSummary.replace(new RegExp(companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
        }
        if (title) {
          workSummary = workSummary.replace(new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
        }
        
        // Remove date ranges
        for (const pattern of datePatterns) {
          workSummary = workSummary.replace(pattern, '');
        }
        
        // Remove location if found
        if (city) {
          workSummary = workSummary.replace(new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 
                                                      (state ? ',?\\s*' + state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''), 'i'), '');
        }
        
        // Clean up the summary
        workSummary = workSummary
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.trim())
          .join('\n');
        
        return {
          title,
          companyName,
          city,
          state,
          startDate,
          endDate,
          workSummary: workSummary.substring(0, 1000) // Allow longer descriptions
        };
      }).filter(exp => exp.companyName || exp.title);
    }
    
    // Extract projects
    const projectPatterns = [
      /(?:Projects|Personal Projects|Selected Projects)(?::|)([\s\S]*?)(?:(?:\n\s*\n\s*[A-Z])|\n[A-Z][a-z]+:|\n\s*Education|$)/i,
      /(?:Portfolio)(?::|)([\s\S]*?)(?:(?:\n\s*\n\s*[A-Z])|\n[A-Z][a-z]+:|\n\s*Education|$)/i
    ];
    
    let projects = [];
    let projectsText = '';
    
    for (const pattern of projectPatterns) {
      const projectsMatch = text.match(pattern);
      if (projectsMatch && projectsMatch[1]) {
        projectsText = projectsMatch[1].trim();
        break;
      }
    }
    
    if (projectsText) {
      // Try to split into project entries
      const lines = projectsText.split('\n');
      let currentEntry = '';
      let entries = [];
      
      for (const line of lines) {
        if (line.match(/^[A-Z][\w\s&.',]+$/) || line.match(/^[\-•\*]\s+[A-Z][\w\s&.',]+/)) {
          if (currentEntry) entries.push(currentEntry);
          currentEntry = line;
        } else if (currentEntry && line.trim()) {
          currentEntry += '\n' + line;
        }
      }
      
      if (currentEntry) entries.push(currentEntry);
      
      // Process each project entry
      projects = entries.map(entry => {
        // Extract project name
        const nameMatch = entry.match(/^[\-•\*]?\s*([A-Z][\w\s&.',]+)/) || 
                         entry.match(/Project\s*:?\s*([A-Z][\w\s&.',]+)/i);
        const name = nameMatch ? nameMatch[1].trim() : 'Unnamed Project';
        
        // Extract technologies used
        const techMatch = entry.match(/(?:Technologies|Stack|Built with|Developed using|Tools)(?::|used:|\s+used\s+|\s*-\s*)([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i) ||
                         entry.match(/(?:[\-•\*]\s+Technologies:)([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i);
        const technologies = techMatch ? techMatch[1].trim() : '';
        
        // Try to extract a link/URL
        const linkMatch = entry.match(/\b((?:https?:\/\/|www\.)[^\s]+)\b/);
        const link = linkMatch ? linkMatch[1] : '';
        
        // Everything else goes into description
        let description = entry;
        if (name) {
          description = description.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
        }
        if (technologies) {
          description = description.replace(new RegExp(technologies.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
        }
        if (link) {
          description = description.replace(new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
        }
        
        // Clean up
        description = description
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.trim())
          .join(' ');
        
        description = description.replace(/^[\-•\*]\s+/, '').trim();
        
        return {
          name,
          description,
          technologies,
          link,
          isVerified: true
        };
      });
    }
    
    // Try to extract a summary/objective
    const summaryPatterns = [
      /(?:Summary|Profile|Objective|Professional\s+Summary|Career\s+Objective)(?::|)([\s\S]*?)(?:\n\s*\n|\n[A-Z])/i,
      /(?:About Me)(?::|)([\s\S]*?)(?:\n\s*\n|\n[A-Z])/i
    ];
    
    let summary = '';
    for (const pattern of summaryPatterns) {
      const summaryMatch = text.match(pattern);
      if (summaryMatch && summaryMatch[1]) {
        summary = summaryMatch[1].trim();
        break;
      }
    }
    
    // If no dedicated summary found, use the first paragraph
    if (!summary) {
      const firstParagraph = text.split('\n\n')[1]; // Skip the first paragraph which might be the name/contact
      if (firstParagraph && firstParagraph.length > 30 && firstParagraph.length < 500) {
        summary = firstParagraph.trim();
      }
    }
    
    // If still no summary, create one from the first 200 chars
    if (!summary) {
      summary = text.substring(0, 400).trim();
    }
    
    // Generate a theme color based on the job field (if detected)
    let themeColor = '#3498db'; // Default blue
    if (jobTitle) {
      if (jobTitle.match(/developer|engineer|programmer|coder/i)) {
        themeColor = '#2980b9'; // Developer blue
      } else if (jobTitle.match(/design|designer|creative|artist/i)) {
        themeColor = '#9b59b6'; // Designer purple
      } else if (jobTitle.match(/manage|manager|director|lead|executive|officer/i)) {
        themeColor = '#27ae60'; // Manager green
      } else if (jobTitle.match(/market|marketing|sales|customer|relations/i)) {
        themeColor = '#e67e22'; // Marketing orange
      } else if (jobTitle.match(/data|analyst|analytics|science|scientist/i)) {
        themeColor = '#2c3e50'; // Data navy
      }
    }
    
    // Return parsed data in the same format as the AI service
    return {
      name,
      email,
      phone,
      jobTitle,
      address,
      skills,
      education,
      experience,
      projects,
      summary,
      themeColor,
      linkedin
    };
  } catch (error) {
    console.error('Error in fallback resume parsing:', error);
    
    // Return a minimal structure to prevent upload failure
    return {
      name: 'Unnamed Resume',
      email: '',
      phone: '',
      jobTitle: '',
      address: '',
      skills: [{ name: 'Skills not extracted', rating: 3 }],
      education: [],
      experience: [],
      projects: [],
      summary: 'Resume details could not be automatically extracted. Please edit manually.',
      themeColor: '#3498db'
    };
  }
};