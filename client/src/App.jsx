
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Login from './components/Login';
import RepoSelector from './components/RepoSelector';
import FileSelector from './components/FileSelector';
import SummaryList from './components/SummaryList';
import CodeDisplay from './components/CodeDisplay';

// Define the base URL for the backend API from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3001';

function App() {
  // --- State Management ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [testSummaries, setTestSummaries] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentView, setCurrentView] = useState('loading');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Authentication Check on App Load ---
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user`, { withCredentials: true });
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          setCurrentView('repos');
        } else {
          setCurrentView('login');
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setIsAuthenticated(false);
        setUser(null);
        setCurrentView('login');
        setError(`Failed to connect to backend. Please ensure the server is running on ${API_BASE_URL}.`);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- Handlers for navigating between views and updating state ---
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('repos');
  };

  const handleLogout = async () => {
    try {
      
      await axios.post(`${API_BASE_URL}/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed on server:', err);
    } finally {
      // Reset all state variables to log the user out on the client side
      setIsAuthenticated(false);
      setUser(null);
      setSelectedRepo(null);
      setSelectedFiles([]);
      setTestSummaries([]);
      setGeneratedCode('');
      setCurrentView('login');
      setError(null);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setSelectedFiles([]);
    setTestSummaries([]);
    setGeneratedCode('');
    setCurrentView('files');
  };

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    setTestSummaries([]);
    setGeneratedCode('');
    setCurrentView('summaries');
  };

  const handleSummariesGenerated = (summaries) => {
    setTestSummaries(summaries);
  };

  const handleCodeGenerated = (code) => {
    setGeneratedCode(code);
    setCurrentView('code');
  };

  // --- Conditional Rendering based on currentView state ---
  const renderView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-700">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mb-4"></div>
          <p className="text-xl font-medium">Loading Application...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md max-w-lg mx-auto mt-10">
          <p className="font-bold text-xl mb-2">Error:</p>
          <p className="mb-3">{error}</p>
          <p className="text-sm">Please ensure your backend server is running and try refreshing the page.</p>
        </div>
      );
    }

    switch (currentView) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} API_BASE_URL={API_BASE_URL} />;
      case 'repos':
        return <RepoSelector onRepoSelect={handleRepoSelect} isAuthenticated={isAuthenticated} API_BASE_URL={API_BASE_URL} />;
      case 'files':
        return <FileSelector selectedRepo={selectedRepo} onFilesSelected={handleFilesSelected} API_BASE_URL={API_BASE_URL} />;
      case 'summaries':
        return <SummaryList selectedFiles={selectedFiles} testSummaries={testSummaries} onSummariesGenerated={handleSummariesGenerated} onCodeGenerated={handleCodeGenerated} API_BASE_URL={API_BASE_URL} />;
      case 'code':
        return <CodeDisplay generatedCode={generatedCode} selectedRepo={selectedRepo} selectedFiles={selectedFiles} API_BASE_URL={API_BASE_URL} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} API_BASE_URL={API_BASE_URL} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <header className="w-full max-w-4xl text-center mb-10 p-6 bg-white rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700 mb-2 tracking-tight">
            TestGenius <span className="text-3xl">🚀</span>
          </h1>
          <p className="text-lg text-gray-600">
            Generate high-quality, professional test cases for your GitHub code with AI.
          </p>
        </div>
        {/* New Logout Button, only shown when authenticated */}
        {isAuthenticated && user && (
          <div className="flex flex-col items-end">
            <p className="mt-4 text-sm text-gray-500">
              Logged in as: <span className="font-semibold text-purple-600">{user.login}</span>
            </p>
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {renderView()}
      </main>

      {/* Navigation/Back Buttons (Optional, but good for UX) */}
      <div className="w-full max-w-4xl mt-6 flex justify-between">
        {currentView !== 'login' && currentView !== 'loading' && (
          <button
            onClick={() => {
              if (currentView === 'repos') setCurrentView('login');
              else if (currentView === 'files') setCurrentView('repos');
              else if (currentView === 'summaries') setCurrentView('files');
              else if (currentView === 'code') setCurrentView('summaries');
              setError(null);
            }}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
          >
            ← Back
          </button>
        )}
        {(currentView === 'files' || currentView === 'summaries' || currentView === 'code') && (
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setUser(null);
                setSelectedRepo(null);
                setSelectedFiles([]);
                setTestSummaries([]);
                setGeneratedCode('');
                setCurrentView('login');
                setLoading(false);
                setError(null);
              }}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 ml-auto"
            >
              Start Over
            </button>
        )}
      </div>
    </div>
  );
}

export default App;

