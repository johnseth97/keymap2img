// src/controllers/imageController.ts

import { fetchKeymap, fetchShields } from '../services/githubService.js';
import parseKeymap from '../services/parserService.js';
import {
    generateImage,
    generateSingleImage,
    mapBindingsToKeyboard,
} from '../services/imageService/index.js';
import { shieldHelper } from '../helpers/shieldHelper.js';
import cache from '../utils/cache.js';
import sanitize from 'sanitize-filename';

import { Request, Response } from 'express';
import { KeyboardHalfConfig, Keyboard } from '../types/keyboard.js';
import logger from '../utils/logger.js'; // Assuming you've implemented the logger as recommended

type ImageType = 'both' | 'left' | 'right' | 'default';

export const imageController = async (
    req: Request,
    res: Response
): Promise<void> => {
    // Log request URL
    logger.info(`Request URL: ${req.url}`);

    const { githubName, repoName, imageName } = req.params;
    const keymapPath = req.params[0]; // Contains the keymap path

    // Sanitize inputs
    const sanitizedGithubName = sanitize(githubName);
    const sanitizedRepoName = sanitize(repoName);
    const sanitizedImageName = sanitize(imageName || '');
    const sanitizedKeymapPath = keymapPath; // Replace backslashes with forward slashes if any

    // Check for directory traversal in keymapPath
    if (sanitizedKeymapPath.includes('..')) {
        logger.warn('Invalid keymap path attempted.');
        res.status(400).send('Invalid keymap path.');
        return;
    }

    // Extract layer name and image type from imageName
    const imageNameWithoutExt = sanitizedImageName.replace('.png', '');
    const parts = imageNameWithoutExt.split('_');

    if (parts.length < 3) {
        // Ensure there are enough parts: img, layerName, [optional]type
        logger.error('Invalid image name format: not enough parts');
        res.status(400).send('Invalid image name format.');
        return;
    }

    const prefix = parts[0];
    let layerName = parts.slice(1, parts.length - 1).join('_'); // Changed from const to let
    let imageType: ImageType = 'default';

    // Determine if the last part indicates a specific image type
    const lastPart = parts[parts.length - 1].toLowerCase();
    if (lastPart === 'both' || lastPart === 'left' || lastPart === 'right') {
        imageType = lastPart as ImageType;
    } else {
        // If no specific type is provided, default to 'both'
        layerName = parts.slice(1).join('_'); // Reassignment is now allowed
        imageType = 'both';
    }

    logger.debug(
        `Request Parameters - Prefix: ${prefix}, Layer Name: ${layerName}, Image Type: ${imageType}`
    );

    if (prefix !== 'img' || !layerName) {
        logger.error('Invalid image name format: missing components');
        res.status(400).send('Invalid image name format.');
        return;
    }

    // Define a unique cache key based on request parameters
    const cacheKey = `${sanitizedGithubName}/${sanitizedRepoName}/${sanitizedKeymapPath}/${sanitizedImageName}`;

    // Check cache first
    const cachedImage = cache.get<Buffer>(cacheKey);
    if (cachedImage) {
        logger.info('Serving image from cache.');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(cachedImage);
        return;
    }

    try {
        // Fetch keymap content from GitHub
        logger.debug('Fetching keymap content from GitHub.');
        const keymapContent = await fetchKeymap(
            sanitizedGithubName,
            sanitizedRepoName,
            sanitizedKeymapPath
        );

        // Fetch shields from GitHub
        logger.debug('Fetching shield configurations from GitHub.');
        const shields = await fetchShields(
            sanitizedGithubName,
            sanitizedRepoName
        );

        // Validate shields and get their configurations
        logger.debug('Processing shield configurations.');
        const shieldConfigs: KeyboardHalfConfig[] = await shieldHelper(shields);

        // Check if necessary shield configurations are present based on imageType
        if (imageType === 'both') {
            const hasLeft = shieldConfigs.some(
                (config) => config.side === 'left'
            );
            const hasRight = shieldConfigs.some(
                (config) => config.side === 'right'
            );

            if (!hasLeft || !hasRight) {
                logger.error(
                    'Incomplete shield configurations: Missing left or right config.'
                );
                res.status(500).send('Incomplete shield configurations.');
                return;
            }
        } else {
            const requiredSide = imageType;
            const hasSide = shieldConfigs.some(
                (config) => config.side === requiredSide
            );
            if (!hasSide) {
                logger.error(
                    `Shield configuration for side "${requiredSide}" not found.`
                );
                res.status(500).send(
                    `Shield configuration for side "${requiredSide}" not found.`
                );
                return;
            }
        }

        // Parse the keymap to get layer data
        logger.debug('Parsing keymap content.');
        const layerData = parseKeymap(keymapContent, layerName);
        logger.debug('Parsed layer data:', JSON.stringify(layerData, null, 2));

        // Map bindings to structured Keyboard object
        logger.debug('Mapping bindings to keyboard structure.');
        const keyboard = mapBindingsToKeyboard(layerData, shieldConfigs);
        logger.debug(
            `Mapped Keyboard Object:,
            ${JSON.stringify(keyboard, null, 2)}
        `
        );

        let imageBuffer: Buffer;

        if (imageType === 'both') {
            // Generate combined image
            logger.debug('Generating combined image.');
            imageBuffer = await generateImage(keyboard, shieldConfigs);
            logger.debug(
                `Combined image generated. Buffer size: ${imageBuffer.length}`
            );
        } else {
            // Generate single shield image
            const side = imageType as 'left' | 'right';
            logger.debug(`Generating ${side} shield image.`);
            const shieldConfig = shieldConfigs.find(
                (config) => config.side === side
            );
            if (!shieldConfig) {
                logger.error(
                    `Shield configuration for side "${side}" not found.`
                );
                res.status(500).send(
                    `Shield configuration for side "${side}" not found.`
                );
                return;
            }
            const shieldKeyboard = {
                [side]: keyboard[side],
            } as Partial<Keyboard>;
            imageBuffer = await generateSingleImage(
                shieldConfig,
                shieldKeyboard[side]!
            );
            logger.info(
                `${side} shield image generated. Buffer size: ${imageBuffer.length}`
            );
        }

        // Set the image in cache
        cache.set(cacheKey, imageBuffer);
        logger.info('Image buffer cached.');

        // Set headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // Send the image
        res.send(imageBuffer);
        logger.info('Image sent successfully.');
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`An error occurred: ${error.message}`);
            res.status(500).send(`Error generating image: ${error.message}`);
        } else {
            logger.error('An unknown error occurred.');
            res.status(500).send('Error generating image.');
        }
        return;
    }
};

export default imageController;
