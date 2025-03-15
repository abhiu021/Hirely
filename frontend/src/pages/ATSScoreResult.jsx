import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



function ATSScoreResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { atsScore, resumeFile } = location.state || {};
  const [numPages, setNumPages] = useState(null);

  // Debug: Log the received data
  console.log('ATS Score:', atsScore);
  console.log('Resume File:', resumeFile);

  // Handle case where atsScore or resumeFile is missing
  useEffect(() => {
    if (!atsScore || !resumeFile) {
      // Redirect to the previous page if data is missing
      navigate('/dashboard'); // Replace with the correct path
    }
  }, [atsScore, resumeFile, navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Ensure atsScore and its properties are defined
  const missingKeywords = atsScore?.missingKeywords || [];
  const personalizedSuggestions = atsScore?.personalizedSuggestions || [];

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>ATS Score Result</h1>
        <div className='flex gap-8'>
          {/* Resume Preview */}
          <div className='w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Resume Preview</h2>
            <Document
              file={`data:application/pdf;base64,${resumeFile}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>

          {/* ATS Score */}
          <div className='w-1/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>ATS Score</h2>
            <div className='text-lg text-gray-700'>
              {atsScore ? (
                <div>
                  {/* Display the job description match score */}
                  <p className='text-4xl font-bold text-blue-600'>
                    {atsScore.jobDescriptionMatch}%
                  </p>
                  <p className='mt-2 text-sm text-gray-500'>
                    This score indicates how well your resume matches the job description.
                  </p>

                  {/* Display missing keywords */}
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>Missing Keywords</h3>
                    <ul className='list-disc list-inside mt-2'>
                      {missingKeywords.map((keyword, index) => (
                        <li key={index} className='text-gray-700'>
                          {keyword}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Display profile summary */}
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>Profile Summary</h3>
                    <p className='mt-2 text-gray-700'>{atsScore.profileSummary}</p>
                  </div>

                  {/* Display personalized suggestions */}
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>Personalized Suggestions</h3>
                    <ul className='list-disc list-inside mt-2'>
                      {personalizedSuggestions.map((suggestion, index) => (
                        <li key={index} className='text-gray-700'>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Display application success rate */}
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>Application Success Rate</h3>
                    <p className='mt-2 text-gray-700'>{atsScore.applicationSuccessRate}%</p>
                  </div>
                </div>
              ) : (
                <p className='text-red-500'>No ATS score available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ATSScoreResult;