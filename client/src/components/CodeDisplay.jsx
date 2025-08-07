
import React, { useState } from 'react';
import axios from 'axios';

function CodeDisplay({ generatedCode, selectedRepo, selectedFiles ,API_BASE_URL}) {
  const [prLoading, setPrLoading] = useState(false);
  const [prError, setPrError] = useState(null);
  const [prSuccessUrl, setPrSuccessUrl] = useState(null);
  const [showPrModal, setShowPrModal] = useState(false); // State to control modal visibility
  const [prTitle, setPrTitle] = useState(`feat: Add AI-generated tests for ${selectedFiles[0]?.name || 'selected files'}`);
  const [prBody, setPrBody] = useState('This pull request introduces AI-generated test cases to improve code coverage and reliability.');
  const [clipboardMessage, setClipboardMessage] = useState(null); // New state for clipboard feedback

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = generatedCode;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setClipboardMessage('Test code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setClipboardMessage('Failed to copy code. Please copy it manually.');
    }
    document.body.removeChild(textarea);

    // Clear the message after a few seconds
    setTimeout(() => {
      setClipboardMessage(null);
    }, 3000);
  };

  // Function to handle creating a Pull Request
  const handleCreatePullRequest = async () => {
    setPrLoading(true);
    setPrError(null);
    setPrSuccessUrl(null);

    if (!selectedRepo || selectedFiles.length === 0 || !generatedCode) {
      setPrError("Missing repository, selected files, or generated code to create PR.");
      setPrLoading(false);
      return;
    }

   
    const originalFileName = selectedFiles[0].name; 
    const testFileName = originalFileName.replace(/(\.[^.]+)$/, '.test$1');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/github/pr`, {
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        fileName: testFileName,
        fileContents: generatedCode,
        prTitle: prTitle,
        prBody: prBody
      }, {
        withCredentials: true
      });

      setPrSuccessUrl(response.data.prUrl);
      setShowPrModal(false); // Close modal on success
    } catch (err) {
      console.error('Error creating PR:', err.response ? err.response.data : err.message);
      setPrError('Failed to create Pull Request. Please check server logs and ensure your GitHub token has "repo" scope.');
    } finally {
      setPrLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Generated Test Code
      </h2>
      <p className="text-md text-gray-600 mb-6 text-center">
        Here is the AI-generated test code based on your selection.
      </p>

      {/* Clipboard Message */}
      {clipboardMessage && (
        <div className="p-3 mb-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-sm text-center">
          <p>{clipboardMessage}</p>
        </div>
      )}

      {prSuccessUrl && (
        <div className="p-4 mb-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm text-center">
          <p className="font-bold">Pull Request Created Successfully!</p>
          <a href={prSuccessUrl} target="_blank" rel="noopener noreferrer" className="text-green-800 underline hover:text-green-900">
            View Pull Request on GitHub
          </a>
        </div>
      )}

      {prError && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
          <p className="font-bold">PR Error:</p>
          <p>{prError}</p>
        </div>
      )}

      <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-6">
        <pre className="p-4 text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-96">
          <code>{generatedCode}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          title="Copy to clipboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 0h-2M10 18H8m4 0h-2m4 0h-2"></path>
          </svg>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={copyToClipboard}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Copy Code
        </button>
        <button
          onClick={() => setShowPrModal(true)} // Open modal
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={prLoading}
        >
          {prLoading ? 'Creating PR...' : 'Create Pull Request'}
        </button>
      </div>

      {/* PR Confirmation Modal */}
      {showPrModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Pull Request</h3>
            <div className="mb-4">
              <label htmlFor="prTitle" className="block text-gray-700 text-sm font-bold mb-2">
                Pull Request Title:
              </label>
              <input
                type="text"
                id="prTitle"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="prBody" className="block text-gray-700 text-sm font-bold mb-2">
                Pull Request Body:
              </label>
              <textarea
                id="prBody"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500 h-32"
                value={prBody}
                onChange={(e) => setPrBody(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPrModal(false)}
                className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={prLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePullRequest}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={prLoading}
              >
                {prLoading ? 'Creating...' : 'Confirm PR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeDisplay;
