
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SummaryList({ selectedFiles, testSummaries, onSummariesGenerated, onCodeGenerated , API_BASE_URL }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null); // Stores the currently selected test summary

  // Effect to generate summaries when selectedFiles change or component mounts
  useEffect(() => {
    const generateSummaries = async () => {
      setLoading(true);
      setError(null);
      setSelectedSummary(null); // Clear selected summary when generating new ones

      if (!selectedFiles || selectedFiles.length === 0) {
        setError("No files selected to generate summaries.");
        setLoading(false);
        return;
      }

      try {
        // Prepare data to send to backend: only name, path, and content
        const filesToSend = selectedFiles.map(file => ({
          name: file.name,
          path: file.path,
          content: file.content
        }));

        const response = await axios.post( `${API_BASE_URL}/api/ai/summaries`, {
          selectedFiles: filesToSend
        }, {
          withCredentials: true
        });

        // Assuming the backend returns an array of summary objects
        onSummariesGenerated(response.data);
      } catch (err) {
        console.error('Error generating summaries:', err.response ? err.response.data : err.message);
        setError('Failed to generate test summaries with AI. Please try again or check server logs.');
      } finally {
        setLoading(false);
      }
    };

    // Only generate summaries if they haven't been generated yet for the current selection
    // This prevents re-generating if the user navigates back and forth
    if (testSummaries.length === 0 && selectedFiles.length > 0) {
      generateSummaries();
    } else if (selectedFiles.length === 0) {
      // If no files are selected (e.g., user navigated directly here without selecting files)
      setError("Please select files to generate summaries.");
    }
  }, [selectedFiles, testSummaries, onSummariesGenerated]);


  const handleSummarySelect = (summary) => {
    setSelectedSummary(summary);
    setError(null); // Clear error when a summary is selected
  };

  // Handler for generating the full test code based on the selected summary
  const handleGenerateCode = async () => {
    if (!selectedSummary) {
      setError("Please select a test case summary first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      const originalFileContent = selectedFiles.map(file =>
        `--- File: ${file.name} (${file.path}) ---\n\`\`\`\n${file.content}\n\`\`\`\n`
      ).join('\n\n');

      const response = await axios.post(`${API_BASE_URL}/api/ai/code`, {
        originalFileContent: originalFileContent,
        summary: selectedSummary,
        framework: selectedSummary.framework // Use the framework suggested by the summary
      }, {
        withCredentials: true
      });

      onCodeGenerated(response.data.code); // Pass generated code back to App.js
    } catch (err) {
      console.error('Error generating code:', err.response ? err.response.data : err.message);
      setError('Failed to generate test code with AI. Please try again or check server logs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg text-gray-600">Generating test summaries with AI...</p>
        <p className="text-sm text-gray-500 mt-2">This might take a moment depending on file size and complexity.</p>
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

  if (testSummaries.length === 0) {
    return (
      <div className="text-center p-6 text-gray-600">
        <p className="text-xl font-semibold mb-4">No test summaries generated.</p>
        <p>This might happen if the AI could not identify clear test scenarios from the selected files.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        AI-Generated Test Case Summaries
      </h2>
      <p className="text-md text-gray-600 mb-6 text-center">
        Review the suggested test scenarios. Select one to generate the full test code.
      </p>

      <div className="max-h-96 overflow-y-auto pr-2 mb-6 border border-gray-200 rounded-lg p-4">
        {testSummaries.map((summary, index) => (
          <div
            key={index} // Using index as key is okay here since summaries are regenerated each time
            onClick={() => handleSummarySelect(summary)}
            className={`p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-200
              ${selectedSummary && selectedSummary.summary === summary.summary
                ? 'bg-purple-100 border-purple-500 shadow-md'
                : 'bg-gray-50 border-gray-200 hover:bg-purple-50 hover:border-purple-300'
              }`}
          >
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              {summary.summary}
              <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {summary.framework}
              </span>
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {summary.scenarios.map((scenario, sIndex) => (
                <li key={sIndex}>{scenario}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerateCode}
          className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedSummary || loading}
        >
          Generate Test Code
        </button>
      </div>
    </div>
  );
}

export default SummaryList;
