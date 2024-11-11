// src/services/githubService.ts

import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';
import process from 'process';
import YAML from 'yaml';
import logger from '../utils/logger.js';

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
        logger.debug(`Fetched keymap content: ${content}`);
        // tell us who fetched the keymap
        logger.info(
            `Fetched keymap from: ${githubName}/${repoName}/${keymapPath}`
        );

        return content;
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error fetching keymap: ${error.message}`);
        } else {
            logger.error(`Error fetching keymap: ${error}`);
        }
        throw new Error('Failed to fetch keymap from GitHub.');
    }
};

const fetchShields = async (githubName: string, repoName: string) => {
    const fileNames = ['build.yml', 'build.yaml'];
    let content = '';

    for (const fileName of fileNames) {
        try {
            const response = await octokit.repos.getContent({
                owner: githubName,
                repo: repoName,
                path: fileName,
            });

            const data = Array.isArray(response.data)
                ? response.data[0]
                : response.data;
            if (data.type !== 'file') {
                throw new Error(`${fileName} path does not point to a file.`);
            }

            if (!data.content) {
                throw new Error(`${fileName} is undefined.`);
            }
            content = Buffer.from(data.content, 'base64').toString('utf-8');
            break; // Exit the loop if the file is found and content is fetched
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`Error fetching ${fileName}, ${error.message}`);
            } else {
                logger.error(`Error fetching ${fileName}:, ${error}`);
            }
        }
    }

    if (!content) {
        throw new Error('Failed to fetch build.yml or build.yaml from GitHub.');
    }

    // Parse the YAML content
    const parsedYaml = YAML.parse(content);

    // Extract the first value for each shield parameter
    const shields = parsedYaml.include.map((item: ShieldItem) => {
        const shieldValues = item.shield.split(' ');
        return shieldValues[0];
    });

    // Log the shields for debugging
    logger.info(`Extracted shields: ${shields}`);

    return shields;
};

interface ShieldItem {
    shield: string;
}

export { fetchKeymap, fetchShields };
