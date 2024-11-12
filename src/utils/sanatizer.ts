// src/utils/sanitizer.ts

import sanitize from 'sanitize-filename';
import { Request } from 'express';

/**
 * Extracts and sanitizes parameters from the request object.
 * @param req - The Express request object.
 * @returns An object containing sanitized parameters.
 */
export function extractAndSanitizeParams(req: Request) {
    const { githubName, repoName, imageName } = req.params;
    const keymapPath = req.params[0];

    const sanitizedPath = {
        githubName: sanitize(githubName),
        repoName: sanitize(repoName),
        imageName: sanitize(imageName || ''),
        keymapPath: sanitizeKeymapPath(keymapPath),
    };

    return { sanitizedPath };
}

/**
 * Sanitizes the keymap path by replacing backslashes with forward slashes.
 * @param path - The keymap path to sanitize.
 * @returns A sanitized keymap path.
 */
function sanitizeKeymapPath(path: string): string {
    return path.replace(/\\/g, '/');
}
