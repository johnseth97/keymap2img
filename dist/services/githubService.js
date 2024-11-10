// src/services/githubService.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';
import process from 'process';
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Ensure GITHUB_TOKEN is set in environment variables
    userAgent: 'keymap2img-app',
});
const fetchKeymap = (githubName, repoName, keymapPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield octokit.repos.getContent({
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
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        // Log the keymap content for debugging
        console.log('Fetched keymap content:', content);
        return content;
    }
    catch (error) {
        console.error('Error fetching keymap:', error.message);
        throw new Error('Failed to fetch keymap from GitHub.');
    }
});
export default fetchKeymap;
