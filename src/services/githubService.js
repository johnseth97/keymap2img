// src/services/githubService.js
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Ensure GITHUB_TOKEN is set in environment variables
  userAgent: 'keymap2img-app',
});

exports.fetchKeymap = async (githubName, repoName) => {
  try {
    // Define the path to the keymap file.
    // Update this path based on your ZMK repository structure.
    const keymapPath = 'keyboards/your_keyboard/keymap.c'; // Example path

    const response = await octokit.repos.getContent({
      owner: githubName,
      repo: repoName,
      path: keymapPath,
    });

    if (response.data.type !== 'file') {
      throw new Error('Keymap path does not point to a file.');
    }

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.error('Error fetching keymap:', error.message);
    throw new Error('Failed to fetch keymap from GitHub.');
  }
};

