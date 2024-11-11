// src/services/githubService.js

import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';
import process from 'process';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Ensure GITHUB_TOKEN is set in environment variables
    userAgent: 'keymap2img-app',
});

const fetchKeymap = async (
    githubName: string,
    repoName: string,
    keymapPath: string
) => {
    try {
        const response = await octokit.repos.getContent({
            owner: githubName,
            repo: repoName,
            path: keymapPath,
        });

        const data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
        if (data.type !== 'file') {
            throw new Error('Keymap path does not point to a file.');
        }

        if (!data.content) {
            throw new Error('Keymap is undefined.');
        }
        const content = Buffer.from(data.content, 'base64').toString('utf-8');

        // Log the keymap content for debugging
        console.log('Fetched keymap content:', content);

        return content;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching keymap:', error.message);
        } else {
            console.error('Error fetching keymap:', error);
        }
        throw new Error('Failed to fetch keymap from GitHub.');
    }
};

export default fetchKeymap;
