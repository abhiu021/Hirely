import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import AnimatedSection from '@/components/ui/animated-section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';

// Add a SpeedometerGauge component
const SpeedometerGauge = ({ score, animate = true }) => {
  // State for animated score
  const [animatedScore, setAnimatedScore] = useState(0);
  const animationRef = useRef(null);
  
  // Set up animation
  useEffect(() => {
    if (!animate) {
      setAnimatedScore(score);
      return;
    }
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const startTime = performance.now();
    const duration = 2000; // Increased animation duration for smoother effect
    const startValue = 0;
    const endValue = score;
    
    // Animation function
    const animateScore = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation (ease-out)
      const easeOut = (t) => 1 - Math.pow(1 - t, 2.5);
      const easedProgress = easeOut(progress);
      
      // Calculate current score
      const currentScore = startValue + (endValue - startValue) * easedProgress;
      setAnimatedScore(currentScore);
      
      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateScore);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateScore);
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, animate]);
  
  // Ensure score is between 0 and 100
  const safeScore = Math.max(0, Math.min(100, Number(animatedScore) || 0));
  
  // Calculate rotation angle based on score (0-100)
  const rotation = (safeScore / 100) * 180 - 90; // -90 to 90 degrees
  
  // Dynamically generate gradient stops based on score for smoother color transition
  const getGradientStops = () => {
    // Define gradient stops with dynamic positions
    return [
      { offset: "0%", color: "#f87171" }, // Red
      { offset: `${Math.max(0, Math.min(50, safeScore * 0.5))}%`, color: "#fb923c" }, // Orange
      { offset: `${Math.max(50, Math.min(75, 50 + (safeScore - 50) * 1))}%`, color: "#facc15" }, // Yellow
      { offset: "100%", color: "#4ade80" }, // Green
    ];
  };
  
  // Generate arc for progress
  const generateArc = (percentage) => {
    // Ensure percentage is between 0 and 1
    const safePercentage = Math.max(0, Math.min(1, percentage));
    
    if (safePercentage === 0) {
      return "M20,100 A80,80 0 0,1 20,100";
    }
    
    const angle = safePercentage * Math.PI;
    const x = 100 - 80 * Math.cos(angle);
    const y = 100 - 80 * Math.sin(angle);
    
    return `M20,100 A80,80 0 0,1 ${x},${y}`;
  };
  
  return (
    <div className="relative w-full max-w-[240px] mx-auto">
      {/* Speedometer background */}
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {getGradientStops().map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
          
          {/* Shadow for 3D effect */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2" />
          </filter>
        </defs>
        
        {/* Gray background arc */}
        <path 
          d="M20,100 A80,80 0 0,1 180,100" 
          fill="none" 
          stroke="#e5e7eb" 
          strokeWidth="12" 
          strokeLinecap="round"
        />
        
        {/* Colored progress arc */}
        <path 
          d={generateArc(safeScore / 100)} 
          fill="none" 
          stroke="url(#scoreGradient)" 
          strokeWidth="12" 
          strokeLinecap="round"
          filter="url(#shadow)"
        />
        
        {/* Score markers */}
        {[0, 25, 50, 75, 100].map((marker) => {
          const angle = (marker / 100) * Math.PI;
          const x = 100 - 80 * Math.cos(angle);
          const y = 100 - 80 * Math.sin(angle);
          return (
            <g key={marker}>
              <line 
                x1={x} 
                y1={y} 
                x2={x + Math.cos(angle) * 8} 
                y2={y + Math.sin(angle) * 8} 
                stroke="#9ca3af" 
                strokeWidth="2" 
              />
              <text 
                x={x + Math.cos(angle) * 20} 
                y={y + Math.sin(angle) * 20 + 5} 
                fontSize="10" 
                fill="#6b7280" 
                textAnchor="middle"
              >
                {marker}
              </text>
            </g>
          );
        })}
        
        {/* Center point */}
        <circle cx="100" cy="100" r="6" fill="#4b5563" />
        
        {/* Needle - removed transition to be driven by animation frames */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 100px' }}>
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="30" 
            stroke="#4b5563" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="4" fill="white" />
        </g>
      </svg>
      
      {/* Score number */}
      <div className="text-center mt-4">
        <span className={`text-4xl font-bold ${
          safeScore >= 80 ? 'text-green-600' : 
          safeScore >= 60 ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          {Math.round(safeScore)}%
        </span>
      </div>
    </div>
  );
};

function ATSScoreResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [atsScore, setAtsScore] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [profileSummary, setProfileSummary] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [successRate, setSuccessRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have the state data
    if (location.state?.atsScore && location.state?.resumeFile) {
      // The atsScore is an object with multiple properties from the AI response
      const scoreData = location.state.atsScore;
      console.log('ATS Score Data:', scoreData);
      
      // Extract the jobDescriptionMatch as a number
      let score = 0;
      if (scoreData.jobDescriptionMatch) {
        // Check if it's a string and handle accordingly
        if (typeof scoreData.jobDescriptionMatch === 'string') {
          // If it's a string, remove any non-numeric characters (like %)
          score = parseFloat(scoreData.jobDescriptionMatch.replace(/[^\d.]/g, ''));
        } else {
          // If it's already a number, use it directly
          score = parseFloat(scoreData.jobDescriptionMatch);
        }
      }
      
      setAtsScore(isNaN(score) ? 0 : score);
      setResumeFile(location.state.resumeFile);
      setJobDescription(location.state.jobDescription || '');
      
      // Set additional data from the AI response if available
      if (scoreData.missingKeywords) {
        setMissingKeywords(Array.isArray(scoreData.missingKeywords) ? scoreData.missingKeywords : []);
      }
      
      if (scoreData.profileSummary) {
        setProfileSummary(typeof scoreData.profileSummary === 'string' ? scoreData.profileSummary : '');
      }
      
      if (scoreData.personalizedSuggestions) {
        setSuggestions(Array.isArray(scoreData.personalizedSuggestions) ? scoreData.personalizedSuggestions : []);
      }
      
      if (scoreData.applicationSuccessRate) {
        let successRate = 0;
        if (typeof scoreData.applicationSuccessRate === 'string') {
          successRate = parseFloat(scoreData.applicationSuccessRate.replace(/[^\d.]/g, ''));
        } else {
          successRate = parseFloat(scoreData.applicationSuccessRate);
        }
        setSuccessRate(isNaN(successRate) ? 0 : successRate);
      }
      
      // Set loading to false after a short delay to show the animation
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      // Redirect to dashboard if no data
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent match! Your resume aligns well with the job description.';
    if (score >= 60) return 'Good match. Your resume covers many of the required skills.';
    return 'Your resume needs improvement to match this job description better.';
  };

  // Function to download the resume as PDF
  const downloadResume = () => {
    if (resumeFile) {
      const linkSource = `data:application/pdf;base64,${resumeFile}`;
      const downloadLink = document.createElement('a');
      const fileName = 'resume.pdf';

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  if (!atsScore && atsScore !== 0) {
    return (
      <DashboardLayout>
        <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 flex items-center justify-center'>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>
          <AnimatedSection animation="fade-up" delay={100} className="mb-6">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center text-gray-700 hover:text-blue-600"
              onClick={goBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3'>ATS Score Results</h1>
            <p className="text-gray-600 mb-8">Your resume's compatibility with the job description</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-up" delay={200} className="col-span-1">
              <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">ATS Score</h2>
                
                {/* Replace the basic score display with the speedometer */}
                <SpeedometerGauge score={atsScore} animate={true} />
                
                <p className="text-gray-700 text-center mt-4">{getScoreMessage(atsScore)}</p>
                
                <div className="mt-6">
                  <Button 
                    onClick={downloadResume} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300} className="col-span-2">
              <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Summary</h2>
                {profileSummary ? (
                  <p className="text-gray-700">{profileSummary}</p>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">Your profile summary highlights your key qualifications and experience relevant to the job description.</p>
                  </div>
                )}
                
                {missingKeywords.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400} className="col-span-3">
              <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                  {suggestions.length > 0 ? 
                    suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    )) : 
                    <>
                      <li>Include more keywords from the job description in your resume.</li>
                      <li>Make sure your skills section clearly lists your relevant technical skills.</li>
                      <li>Quantify your achievements with specific numbers and metrics.</li>
                      <li>Ensure your resume is properly formatted for ATS systems.</li>
                      <li>Consider adding a summary section that directly addresses the job requirements.</li>
                    </>
                  }
                </ul>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={goBack} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create New Resume
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {jobDescription && (
              <AnimatedSection animation="fade-up" delay={500} className="col-span-3">
                <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-[400px] overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">{jobDescription}</p>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ATSScoreResult; 