import React, { useState } from "react";
import axios from "axios";

const CreateCV = () => {
  const [domain, setDomain] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("domain", domain);
    formData.append("company", company);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cv/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );
      setAnalysisResults(response.data);
      setProjects(response.data.extractedProjects);
      setSuggestions(response.data.suggestions);
      setAtsScore(response.data.atsScore);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">JobReady Resume Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Panel */}
        <div className="col-span-1">
          <div className="border rounded p-4 bg-white shadow">
            <h2 className="text-xl font-semibold mb-4">Upload Links</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload PDFs, Drive links, or GitHub repositories to extract key
              CV points for the projects section.
            </p>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="border w-full p-2 mb-4"
                placeholder="e.g., Software Engineering"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border w-full p-2 mb-4"
                placeholder="e.g., Google"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="border w-full p-2 mb-4"
                placeholder="Paste the job description here"
              ></textarea>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload CV
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border w-full p-2 mb-4"
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${
                  loading ? 'opacity-50' : 'hover:bg-blue-600'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze CV'}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="w-full bg-gray-200 rounded h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
          
          {/* ATS Score */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">ATS Score</h4>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded h-4">
                <div 
                  className={`h-4 rounded ${
                    analysisResults.atsScore > 70 ? 'bg-green-500' : 
                    analysisResults.atsScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisResults.atsScore}%` }}
                />
              </div>
              <span className="ml-4 font-bold">{analysisResults.atsScore}%</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Suggestions</h4>
            <ul className="list-disc pl-5">
              {analysisResults.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700 mb-2">{suggestion}</li>
              ))}
            </ul>
          </div>

          {/* Extracted Projects */}
          <div>
            <h4 className="font-semibold mb-2">Extracted Projects</h4>
            <div className="grid gap-4">
              {analysisResults.extractedProjects.map((project, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded">
                  <h5 className="font-medium">{project.title}</h5>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCV;
