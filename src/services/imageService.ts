// src/services/imageService.ts

import { shieldHelper } from '../helpers/shieldHelper.js';
import { KeyboardHalfConfig, Keyboard } from '../types/keyboard.js';
import logger from '../utils/logger.js';
import {
    generateImage,
    generateSingleImage,
} from './imageGenerationServices/index.js';

type ImageType = 'both' | 'left' | 'right' | 'default';

/**
 * Processes shield configurations and ensures necessary sides are present.
 * @param shields - The shields fetched from GitHub.
 * @param imageType - The type of image requested.
 * @returns An array of KeyboardHalfConfig.
 */
export async function processShieldConfigs(
    shields: string[],
    imageType: ImageType
): Promise<KeyboardHalfConfig[]> {
    logger.debug('Processing shield configurations.');
    const shieldConfigs = await shieldHelper(shields);

    if (imageType === 'both') {
        const hasLeft = shieldConfigs.some((config) => config.side === 'left');
        const hasRight = shieldConfigs.some(
            (config) => config.side === 'right'
        );

        if (!hasLeft || !hasRight) {
            logger.error(
                'Incomplete shield configurations: Missing left or right config.'
            );
            throw new Error('Incomplete shield configurations.');
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
            throw new Error(
                `Shield configuration for side "${requiredSide}" not found.`
            );
        }
    }

    return shieldConfigs;
}

/**
 * Generates the image buffer based on the keyboard and shield configurations.
 * @param keyboard - The keyboard object.
 * @param shieldConfigs - The shield configurations.
 * @param imageType - The type of image requested.
 * @returns A Promise that resolves to an image buffer.
 */
export async function generateImageBuffer(
    keyboard: Keyboard,
    shieldConfigs: KeyboardHalfConfig[],
    imageType: ImageType
): Promise<Buffer> {
    let imageBuffer: Buffer;

    if (imageType === 'both') {
        logger.debug('Generating combined image.');
        imageBuffer = await generateImage(keyboard, shieldConfigs);
        logger.debug(
            `Combined image generated. Buffer size: ${imageBuffer.length}`
        );
    } else {
        const side = imageType as 'left' | 'right';
        logger.debug(`Generating ${side} shield image.`);
        const shieldConfig = shieldConfigs.find(
            (config) => config.side === side
        );
        if (!shieldConfig) {
            logger.error(`Shield configuration for side "${side}" not found.`);
            throw new Error(
                `Shield configuration for side "${side}" not found.`
            );
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

    return imageBuffer;
}
