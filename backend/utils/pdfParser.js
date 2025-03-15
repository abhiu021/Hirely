import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import 'dotenv/config';
import fetch from 'node-fetch';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

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
    throw new Error('Failed to parse resume with AI');
  }
};
/**
 * Extracts text from a PDF file buffer.
 * @param {Buffer} fileBuffer - The PDF file buffer.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPdf = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);

    // Check if text was extracted
    if (!data.text) {
      throw new Error('No text found in the PDF file.');
    }

    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error.message);
    throw new Error('Failed to extract text from PDF. Please ensure the file is valid.');
  }
};

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
  return {
    title: parsedData.name || 'Untitled Resume',
    resumeId: new mongoose.Types.ObjectId().toString(),
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
    throw new Error('Failed to parse resume text. Please ensure the text is valid.');
  }
};