
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RepoSelector({ onRepoSelect, isAuthenticated , API_BASE_URL}) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch repositories only if authenticated
    if (isAuthenticated) {
      const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_BASE_URL}/api/github/repos`, { withCredentials: true });
          setRepos(response.data);
        } catch (err) {
          console.error('Error fetching repositories:', err);
          setError('Failed to load repositories. Please ensure you have granted repository access to the GitHub app, or try logging in again.');
        } finally {
          setLoading(false);
        }
      };
      fetchRepos();
    } else {
      setLoading(false); // Not authenticated, so no loading needed
      setError('Please log in to view your repositories.');
    }
  }, [isAuthenticated]); // Re-run when authentication status changes

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg text-gray-600">Loading repositories...</p>
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

  if (repos.length === 0) {
    return (
      <div className="text-center p-6 text-gray-600">
        <p className="text-xl font-semibold mb-4">No repositories found.</p>
        <p>Ensure your GitHub account has repositories, and the app has the necessary permissions.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a GitHub Repository</h2>
      <p className="text-md text-gray-600 mb-6 text-center">
        Choose a repository from your account to start generating test cases.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
        {repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => onRepoSelect(repo)}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col justify-between h-full bg-gray-50 hover:bg-purple-50"
          >
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-1">{repo.name}</h3>
              <p className="text-sm text-gray-600 mb-2 truncate">{repo.description || 'No description provided.'}</p>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <p>Stars: {repo.stargazers_count}</p>
              <p>Language: {repo.language || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepoSelector;
