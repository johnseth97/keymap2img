// src/utils/cacheUtils.ts

import cache from './cache.js';
import logger from './logger.js';

/**
 * Generates a unique cache key based on request parameters.
 * @param githubName - The GitHub username.
 * @param repoName - The repository name.
 * @param keymapPath - The keymap path.
 * @param imageName - The image name.
 * @returns A unique cache key string.
 */
export function generateCacheKey(
    githubName: string,
    repoName: string,
    keymapPath: string,
    imageName: string
): string {
    return `${githubName}/${repoName}/${keymapPath}/${imageName}`;
}

/**
 * Retrieves an image from the cache if available.
 * @param cacheKey - The key to look up in the cache.
 * @returns The cached image buffer or undefined.
 */
export function getCachedImage(cacheKey: string): Buffer | undefined {
    const cachedImage = cache.get<Buffer>(cacheKey);
    if (cachedImage) {
        logger.info('Serving image from cache.');
    }
    return cachedImage;
}

/**
 * Caches the image buffer with the specified key.
 * @param cacheKey - The key to store the image under.
 * @param imageBuffer - The image buffer to cache.
 */
export function cacheImage(cacheKey: string, imageBuffer: Buffer): void {
    cache.set(cacheKey, imageBuffer);
    logger.info('Image buffer cached.');
}
