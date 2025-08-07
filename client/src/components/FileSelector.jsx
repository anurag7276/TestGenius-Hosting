
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileSelector({ selectedRepo, onFilesSelected ,API_BASE_URL}) {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // Stores the files currently checked by the user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      if (!selectedRepo) {
        setError("No repository selected. Please go back and select one.");
        setLoading(false);
        return;
      }

      try {
        // Fetch files from the selected repository
        const response = await axios.get(`${API_BASE_URL}/api/github/files`, {
          params: {
            owner: selectedRepo.owner.login,
            repo: selectedRepo.name,
            // path: '' // Default to root, can be extended later for subdirectories
          },
          withCredentials: true
        });

        // Filter out any files that had errors fetching content (indicated by content starting with "Error fetching content:")
        const validFiles = response.data.filter(file => !file.content.startsWith("Error fetching content:"));
        setFiles(validFiles);
        setSelectedFiles([]); // Reset selected files when new repo files are loaded
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Failed to load files from the repository. Ensure the repository is not empty or has accessible files.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [selectedRepo]); // Re-fetch files when the selectedRepo changes

  // Handler for checkbox changes
  const handleFileCheckboxChange = (file) => {
    setSelectedFiles(prevSelectedFiles => {
      if (prevSelectedFiles.some(f => f.path === file.path)) {
        // If file is already selected, remove it
        return prevSelectedFiles.filter(f => f.path !== file.path);
      } else {
        // If file is not selected, add it
        return [...prevSelectedFiles, file];
      }
    });
  };

  const handleGenerateSummaries = () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file to generate summaries.");
      return;
    }
    setError(null); // Clear any previous errors
    onFilesSelected(selectedFiles); // Pass selected files back to App.js
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg text-gray-600">Loading files from {selectedRepo?.name || 'repository'}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-6 text-gray-600">
        <p className="text-xl font-semibold mb-4">No accessible files found in "{selectedRepo?.name}".</p>
        <p>Please select a different repository or ensure this one contains code files.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Select Files from "{selectedRepo?.name}"
      </h2>
      <p className="text-md text-gray-600 mb-6 text-center">
        Choose the code files you want AI to analyze for test case summaries.
      </p>

      <div className="max-h-96 overflow-y-auto pr-2 mb-6 border border-gray-200 rounded-lg p-4">
        {files.map((file) => (
          <label key={file.path} className="flex items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer rounded-md">
            <input
              type="checkbox"
              checked={selectedFiles.some(f => f.path === file.path)}
              onChange={() => handleFileCheckboxChange(file)}
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="ml-3 text-gray-800 font-medium text-base">{file.name}</span>
            <span className="ml-2 text-gray-500 text-sm">({file.path})</span>
            <span className="ml-auto text-gray-400 text-xs">{Math.round(file.size / 1024)} KB</span>
          </label>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerateSummaries}
          className="px-8 py-4 bg-purple-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedFiles.length === 0}
        >
          Generate Test Case Summaries ({selectedFiles.length})
        </button>
      </div>
    </div>
  );
}

export default FileSelector;
