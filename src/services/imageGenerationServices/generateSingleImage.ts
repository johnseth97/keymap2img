// src/services/imageService/generateSingleImage.ts

import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { KeyRow, KeyboardHalfConfig } from '../../types/keyboard.js';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from '../../utils/logger.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the absolute path to the fonts directory
const fontsDirectory = path.resolve(__dirname, '../resources/fonts');

// Register the custom font
const fontPath = path.join(fontsDirectory, 'Roboto-Regular.ttf');
const fontFamily = 'Roboto Regular'; // Ensure this matches the actual font family name

const fontRegistrationResult = GlobalFonts.registerFromPath(
    fontPath,
    fontFamily
);

// Log the font registration result
logger.debug(
    `Font registration successful?: ${fontRegistrationResult} ${fontFamily} ${fontPath}`
);

/**
 * Generates an image buffer for a single shield configuration (left or right).
 *
 * @param shieldConfig - The shield configuration object containing rendering parameters and key rows.
 * @param keyRows - An array of KeyRow objects representing the shield's rows.
 * @returns A Promise that resolves to a PNG image buffer.
 */
export async function generateSingleImage(
    shieldConfig: KeyboardHalfConfig,
    keyRows: KeyRow[]
): Promise<Buffer> {
    const { keyWidth, keyHeight, canvasWidth, canvasHeight } = shieldConfig;

    // Create a canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#FFFFFFA0'; // Light gray with transparency
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Set font properties
    ctx.font = '14px Roboto Regular'; // Adjust font size and family as needed
    ctx.fillStyle = '#000000'; // Text color

    for (const row of keyRows) {
        for (const key of row.keys) {
            const { label, behavior, position } = key;
            const { x, y } = position;

            // Determine key appearance based on behavior
            let fillColor = '#FFFFFF'; // Default white background
            let strokeColor = '#000000'; // Default black border

            switch (behavior) {
                case '&kp':
                    fillColor = '#FFFFFF'; // Regular key
                    break;
                case '&mt':
                    fillColor = '#FFD700'; // Gold color for Mod-Tap
                    break;
                case '&lt':
                    fillColor = '#ADD8E6'; // Light blue for Layer-Tap
                    break;
                default:
                    fillColor = '#D3D3D3'; // Light gray for other behaviors
            }

            // Draw the key background
            ctx.fillStyle = fillColor;
            ctx.fillRect(x, y, keyWidth, keyHeight);

            // Draw the key border
            ctx.strokeStyle = strokeColor;
            ctx.strokeRect(x, y, keyWidth, keyHeight);

            // Draw the key label centered within the key
            const textX = x + keyWidth / 2;
            const textY = y + keyHeight / 2;

            ctx.fillStyle = '#000000'; // Reset text color to black
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, textX, textY);
        }
    }

    // Convert the canvas to a buffer
    const imageBuffer = canvas.toBuffer('image/png');

    // Return the generated image buffer
    return imageBuffer;
}
