// src/services/imageService/index.ts
export { generateSingleImage } from './generateSingleImage.js';
export { generateImage } from './generateImage.js';
export { mapBindingsToKeyboard } from './mapBindingsToKeyboard.js';

import { GlobalFonts } from '@napi-rs/canvas';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the absolute path to the fonts directory
const fontsDirectory = path.resolve(__dirname, '../../resources/fonts');

// Register the custom font
const fontPath = path.join(fontsDirectory, 'Roboto-Regular.ttf');
const fontFamily = 'Roboto Regular'; // Ensure this matches the actual font family name

export const fontRegistrationResult = GlobalFonts.registerFromPath(
    fontPath,
    fontFamily
);
