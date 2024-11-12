// src/controllers/imageController.ts

import { Request, Response } from 'express';

// Services
import { fetchKeymap, fetchShields } from '../services/githubService.js';
import parseKeymap from '../services/parsing/keymapParserService.js';
import {
    generateImageBuffer,
    processShieldConfigs,
} from '../services/imageService.js';
import { mapBindingsToKeyboard } from '../services/imageGenerationServices/index.js';

// Utilities
import { extractAndSanitizeParams } from '../utils/sanatizer.js';
import {
    validateKeymapPath,
    validateImageName,
} from '../utils/validationUtils.js';
import { parseImageName } from '../utils/parsingUtils.js';
import {
    generateCacheKey,
    getCachedImage,
    cacheImage,
} from '../utils/cacheUtils.js';
import { sendImageResponse } from '../utils/imageUtils.js';
import { handleError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

export const imageController = async (
    req: Request,
    res: Response
): Promise<void> => {
    logger.info(`Request URL: ${req.url}`);

    try {
        // Step 1: Extract and sanitize parameters
        const {
            sanitizedPath: { keymapPath, githubName, repoName, imageName },
        } = extractAndSanitizeParams(req);

        // Step 2: Validate keymap path
        validateKeymapPath(keymapPath);

        // Step 3: Parse image name to get prefix, layerName, imageType
        const { prefix, layerName, imageType } = parseImageName(imageName);

        // Step 4: Validate image name and parameters
        validateImageName(prefix, layerName);

        // Step 5: Generate cache key
        const cacheKey = generateCacheKey(
            githubName,
            repoName,
            keymapPath,
            imageName
        );

        // Step 6: Check cache
        const cachedImage = getCachedImage(cacheKey);
        if (cachedImage) {
            sendImageResponse(res, cachedImage);
            return;
        }

        // Step 7: Fetch keymap content and shield configurations
        const [keymapContent, shields] = await Promise.all([
            fetchKeymap(githubName, repoName, keymapPath),
            fetchShields(githubName, repoName),
        ]);

        // Step 8: Process shield configurations
        const shieldConfigs = await processShieldConfigs(shields, imageType);

        // Step 9: Parse keymap
        const layerData = parseKeymap(keymapContent, layerName);

        // Step 10: Map bindings to keyboard structure
        const keyboard = mapBindingsToKeyboard(layerData, shieldConfigs);

        // Step 11: Generate image
        const imageBuffer = await generateImageBuffer(
            keyboard,
            shieldConfigs,
            imageType
        );

        // Step 12: Cache the image
        cacheImage(cacheKey, imageBuffer);

        // Step 13: Send image response
        sendImageResponse(res, imageBuffer);

        logger.info('Image sent successfully.');
    } catch (error) {
        handleError(error, res);
    }
};

export default imageController;
