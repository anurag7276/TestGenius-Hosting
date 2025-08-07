
import { callGeminiApi } from '../utils/callGeminiApi.js';

export const generateSummaries = async (req, res) => {
  const {
    selectedFiles
  } = req.body;

  if (!selectedFiles || selectedFiles.length === 0) {
    return res.status(400).json({
      error: 'No files selected for summary generation.'
    });
  }

  const combinedFileContent = selectedFiles.map(file =>
    `--- File: ${file.name} (${file.path}) ---\n\`\`\`\n${file.content}\n\`\`\`\n`
  ).join('\n\n');

  const prompt = `
  You are an expert software test engineer. Your task is to analyze the provided code files and identify logical, high-quality test scenarios. For each scenario, provide a concise summary and suggest a suitable testing framework (e.g., Jest for JavaScript/React, JUnit for Java, Selenium for web automation, Pytest for Python).

  The output should be a JSON array of objects, where each object has the following structure:
  {
    "summary": "A brief description of the test scenario.",
    "framework": "Suggested testing framework (e.g., Jest, JUnit, Selenium, Pytest).",
    "scenarios": [
      "Specific test case 1: Description of what to test.",
      "Specific test case 2: Description of what to test."
    ]
  }

  Ensure the summaries and scenarios are professional, meaningful, and directly relevant to the code's functionality, covering both happy paths and edge cases. If no clear test scenarios are identified, return an empty array.

  Code Files to Analyze:
  ${combinedFileContent}
  `;

  const payload = {
    contents: [{
      role: "user",
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            "summary": {
              "type": "STRING"
            },
            "framework": {
              "type": "STRING"
            },
            "scenarios": {
              "type": "ARRAY",
              "items": {
                "type": "STRING"
              }
            }
          },
          "propertyOrdering": ["summary", "framework", "scenarios"]
        }
      }
    }
  };

  try {
    const geminiResponseText = await callGeminiApi(payload);
    const parsedResponse = JSON.parse(geminiResponseText);
    res.json(parsedResponse);
  } catch (error) {
    console.error('Error generating summaries with AI:', error);
    res.status(500).json({
      error: 'Failed to generate test summaries with AI. Please try again.'
    });
  }
};

export const generateCode = async (req, res) => {
  const {
    originalFileContent,
    summary,
    framework
  } = req.body;

  if (!originalFileContent || !summary || !framework) {
    return res.status(400).json({
      error: 'Missing required data for test code generation.'
    });
  }

  let langHint = '';
  if (framework.toLowerCase().includes('jest') || framework.toLowerCase().includes('react') || framework.toLowerCase().includes('javascript')) {
    langHint = 'javascript';
  } else if (framework.toLowerCase().includes('junit') || framework.toLowerCase().includes('java')) {
    langHint = 'java';
  } else if (framework.toLowerCase().includes('selenium') || framework.toLowerCase().includes('pytest') || framework.toLowerCase().includes('python')) {
    langHint = 'python';
  } else if (framework.toLowerCase().includes('c#') || framework.toLowerCase().includes('nunit')) {
    langHint = 'csharp';
  }

  const prompt = `
  You are an expert software test engineer.
  Generate a complete, production-ready test case for the provided original code using the **${framework}** framework.
  The test should strictly adhere to the scenario described in the following summary, covering all specific test cases mentioned.
  Add clear, professional comments to explain the purpose of each test block, setup, and assertion.
  Ensure the generated code is clean, readable, follows best practices for the chosen framework, and is ready to be directly used in a project.
  Only output the code block, nothing else.

  Test Scenario Summary:
  \`\`\`json
  ${JSON.stringify(summary, null, 2)}
  \`\`\`

  Original Code:
  \`\`\`${langHint}
  ${originalFileContent}
  \`\`\`

  Generated Test Code:
  `;

  const payload = {
    contents: [{
      role: "user",
      parts: [{
        text: prompt
      }]
    }]
  };

  try {
    const geminiResponseText = await callGeminiApi(payload);
    res.json({
      code: geminiResponseText
    });
  } catch (error) {
    console.error('Error generating test code with AI:', error);
    res.status(500).json({
      error: 'Failed to generate test code with AI. Please try again.'
    });
  }
};
