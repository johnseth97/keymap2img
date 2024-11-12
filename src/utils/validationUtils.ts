// src/utils/validationUtils.ts

import logger from './logger.js';

/**
 * Validates the keymap path to prevent directory traversal attacks.
 * @param keymapPath - The keymap path to validate.
 */
export function validateKeymapPath(keymapPath: string): void {
    if (keymapPath.includes('..')) {
        logger.warn('Invalid keymap path attempted.');
        throw new Error('Invalid keymap path.');
    }
}

/**
 * Validates the image name format.
 * @param prefix - The prefix extracted from the image name.
 * @param layerName - The layer name extracted from the image name.
 */
export function validateImageName(prefix: string, layerName: string): void {
    if (prefix !== 'img' || !layerName) {
        logger.error('Invalid image name format: missing components');
        throw new Error('Invalid image name format.');
    }
}
