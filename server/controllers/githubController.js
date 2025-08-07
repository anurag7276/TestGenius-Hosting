
import { Octokit } from '@octokit/rest';
import axios from 'axios';

export const getRepos = async (req, res) => {
  const octokit = new Octokit({
    auth: req.user.accessToken
  });
  try {
    const {
      data
    } = await octokit.rest.repos.listForAuthenticatedUser({
      type: 'all',
      per_page: 100
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching repositories:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Failed to fetch repositories from GitHub.'
    });
  }
};

export const getFiles = async (req, res) => {
  const {
    owner,
    repo,
    path = ''
  } = req.query;
  const octokit = new Octokit({
    auth: req.user.accessToken
  });

  try {
    const {
      data
    } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path
    });

    let filesToProcess = [];
    if (Array.isArray(data)) {
      filesToProcess = data.filter(item => item.type === 'file');
    } else if (data.type === 'file') {
      filesToProcess.push(data);
    } else {
      return res.json([]);
    }

    const filesWithContent = await Promise.all(filesToProcess.map(async (file) => {
      try {
        const fileContentResponse = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
          mediaType: {
            format: 'raw'
          }
        });
        return {
          name: file.name,
          path: file.path,
          type: file.type,
          size: file.size,
          content: fileContentResponse.data
        };
      } catch (contentError) {
        console.warn(`Could not fetch content for file ${file.path}:`, contentError.message);
        return {
          name: file.name,
          path: file.path,
          type: file.type,
          size: file.size,
          content: `Error fetching content: ${contentError.message}`
        };
      }
    }));

    res.json(filesWithContent);
  } catch (error) {
    console.error('Error fetching files or their content:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Failed to fetch files from GitHub repository.'
    });
  }
};

export const createPullRequest = async (req, res) => {
  const {
    owner,
    repo,
    fileName,
    fileContents,
    prTitle,
    prBody
  } = req.body;
  const octokit = new Octokit({
    auth: req.user.accessToken
  });
  const branchName = `ai-generated-tests/${Date.now()}`;

  try {
    const {
      data: repoData
    } = await octokit.rest.repos.get({
      owner,
      repo
    });
    const defaultBranch = repoData.default_branch;

    const {
      data: {
        object: {
          sha: parentSha
        }
      }
    } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`
    });

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: parentSha
    });

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `generated_tests/${fileName}`,
      message: `feat: Add AI-generated tests for ${fileName}`,
      content: Buffer.from(fileContents).toString('base64'),
      branch: branchName
    });

    const {
      data: pr
    } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: prTitle,
      head: branchName,
      base: defaultBranch,
      body: prBody
    });

    res.json({
      prUrl: pr.html_url,
      message: 'Pull Request created successfully!'
    });
  } catch (error) {
    console.error('Error creating pull request:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Failed to create pull request. Please check server logs and ensure your GitHub token has "repo" scope.'
    });
  }
};
