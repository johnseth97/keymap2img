// src/services/imageService/generateImage.ts

import { createCanvas, Image } from '@napi-rs/canvas';
import { Keyboard, KeyboardHalfConfig } from '../../types/keyboard.js';
import { generateSingleImage } from './generateSingleImage.js';

import logger from '../../utils/logger.js';

/**
 * Generates a combined image buffer for both left and right shield configurations.
 *
 * @param keyboard - The structured Keyboard object.
 * @param shieldConfigs - An array containing both left and right shield configurations.
 * @returns A Promise that resolves to a combined PNG image buffer.
 */
export async function generateImage(
    keyboard: Keyboard,
    shieldConfigs: KeyboardHalfConfig[]
): Promise<Buffer> {
    // Log the received shield configurations
    logger.debug(
        'Received shield configurations for image generation:',
        JSON.stringify(shieldConfigs, null, 2)
    );

    // Find shield configurations for left and right
    const leftConfig = shieldConfigs.find((config) => config.side === 'left');
    const rightConfig = shieldConfigs.find((config) => config.side === 'right');

    // Log the found configurations
    logger.debug(
        'Left Config:',
        leftConfig ? JSON.stringify(leftConfig, null, 2) : 'Not Found'
    );
    logger.debug(
        'Right Config:',
        rightConfig ? JSON.stringify(rightConfig, null, 2) : 'Not Found'
    );

    if (!leftConfig || !rightConfig) {
        throw new Error('Left or right configuration not found.');
    }

    // Generate images for both left and right configurations
    logger.debug('Generating left shield image...');
    const leftImageBuffer = await generateSingleImage(
        leftConfig,
        keyboard.left
    );
    logger.debug(
        'Left shield image generated. Buffer size:',
        leftImageBuffer.length
    );

    logger.debug('Generating right shield image...');
    const rightImageBuffer = await generateSingleImage(
        rightConfig,
        keyboard.right
    );
    logger.debug(
        'Right shield image generated. Buffer size:',
        rightImageBuffer.length
    );

    // Combine the left and right images into a single image
    logger.debug(
        'Combining left and right shield images into a single image...'
    );
    const combinedCanvas = createCanvas(
        leftConfig.canvasWidth + rightConfig.canvasWidth,
        leftConfig.canvasHeight // Assuming both have the same height
    );
    const combinedCtx = combinedCanvas.getContext('2d');

    // Draw the left image
    const leftImage = new Image();
    leftImage.src = leftImageBuffer;
    combinedCtx.drawImage(leftImage, 0, 0);
    logger.debug('Left shield image drawn on combined canvas.');

    // Draw the right image
    const rightImage = new Image();
    rightImage.src = rightImageBuffer;
    combinedCtx.drawImage(rightImage, leftConfig.canvasWidth, 0);
    logger.debug('Right shield image drawn on combined canvas.');

    // Convert the combined canvas to a buffer
    const combinedImageBuffer = combinedCanvas.toBuffer('image/png');
    logger.debug(
        'Combined image buffer generated. Size:',
        combinedImageBuffer.length
    );

    // Return the combined image buffer
    return combinedImageBuffer;
}
