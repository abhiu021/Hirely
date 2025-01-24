import React, { useState } from "react";
import axios from "axios";

const CreateResume = () => {
  const [domain, setDomain] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [atsScore, setAtsScore] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        }
      );
      setProjects(response.data.extractedProjects);
      setSuggestions(response.data.suggestions);
      setAtsScore(response.data.atsScore);
    } catch (err) {
      console.error(err);
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
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Analyze CV
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;
