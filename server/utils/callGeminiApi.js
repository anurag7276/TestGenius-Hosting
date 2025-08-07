
import axios from 'axios';

// --- Helper for Gemini API calls with Exponential Backoff ---
export async function callGeminiApi(payload) {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  let retries = 0;
  const maxRetries = 5;
  const baseDelay = 1000;

  while (retries < maxRetries) {
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = response.data;

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected Gemini API response structure. No content found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 429 && retries < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, retries);
        console.warn(`Rate limit hit. Retrying in ${delay / 1000} ms... (Attempt ${retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get response from AI: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
      }
    }
  }
  throw new Error('Max retries exceeded for Gemini API call. Still failing.');
}
