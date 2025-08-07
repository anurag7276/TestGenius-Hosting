
import React from 'react';

function Login({ onLoginSuccess , API_BASE_URL }) {
  // Function to handle GitHub login click
  const handleGitHubLogin = () => {
   
     window.location.href = `${API_BASE_URL}/api/github/login`;
  
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to TestGenius</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Connect your GitHub account to start generating intelligent test cases for your code.
      </p>
      <button
        onClick={handleGitHubLogin}
        className="flex items-center px-8 py-4 bg-purple-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        {/* GitHub Octocat SVG Icon */}
        <svg
          className="w-7 h-7 mr-3"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.499.09.679-.217.679-.481 0-.237-.008-.862-.013-1.702-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.618.069-.606.069-.606 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.089 2.91.835.09-.647.35-1.089.636-1.33-2.22-.253-4.555-1.113-4.555-4.931 0-1.09.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.865c.85.004 1.705.115 2.504.337 1.909-1.29 2.747-1.022 2.747-1.022.546 1.379.202 2.398.099 2.65.64.698 1.028 1.592 1.028 2.682 0 3.829-2.339 4.673-4.566 4.922.357.307.636.92.636 1.815 0 1.334-.013 2.41-.013 2.737 0 .264.179.573.684.481C21.137 20.195 24 16.447 24 12.017 24 6.484 19.522 2 14 2h-2z"
            clipRule="evenodd"
          />
        </svg>
        Login with GitHub
      </button>
    </div>
  );
}

export default Login;
