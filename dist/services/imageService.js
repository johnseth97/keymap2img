// src/services/imageService.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import { fileURLToPath } from 'url';
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve the absolute path to the fonts directory
const fontsDirectory = path.resolve(__dirname, '../../resources/fonts');
// Register the custom font
const fontPath = path.join(fontsDirectory, 'Roboto-Regular.ttf');
const fontFamily = 'Roboto Regular'; // Ensure this matches the actual font family name
const fontRegistrationResult = GlobalFonts.registerFromPath(fontPath, fontFamily);
// Log the font registration result
console.log(`Font registration successful?: ${fontRegistrationResult} ${fontFamily} ${fontPath}`);
export function generateImage(layerData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Define canvas dimensions (adjust as needed)
        const canvasWidth = 800;
        const canvasHeight = 600;
        // Create a canvas
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        // Set background color
        ctx.fillStyle = '#FFFFFFA0'; // Light gray with transparency
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // Load a font (optional)
        ctx.font = '14px Roboto Regular'; // Adjust font as needed
        ctx.fillStyle = '#000000'; // Text color
        // Example: Draw the key labels on the canvas
        const keysPerRow = 12; // Adjust based on your keyboard layout
        const keyWidth = 60; // Adjust as needed
        const keyHeight = 60; // Adjust as needed
        for (let i = 0; i < layerData.length; i++) {
            const keyBinding = layerData[i];
            const behavior = keyBinding.behavior;
            const args = keyBinding.args;
            // Combine arguments to form the key label
            const keyLabel = args.join(' ');
            // Calculate x and y positions
            const x = (i % keysPerRow) * keyWidth;
            const y = Math.floor(i / keysPerRow) * keyHeight;
            // Modify the key appearance based on the behavior
            if (behavior === '&kp') {
                // Regular key press, standard rendering
                ctx.strokeStyle = '#000000'; // Key border color
                ctx.fillStyle = '#FFFFFF'; // Key background color
            }
            else if (behavior === '&mt') {
                // Mod-Tap, highlight the key
                ctx.strokeStyle = '#000000';
                ctx.fillStyle = '#FFD700'; // Gold color
            }
            else if (behavior === '&lt') {
                // Layer-Tap, use a different color
                ctx.strokeStyle = '#000000';
                ctx.fillStyle = '#ADD8E6'; // Light blue
            }
            else {
                // Other behaviors
                ctx.strokeStyle = '#000000';
                ctx.fillStyle = '#D3D3D3'; // Light gray
            }
            // Draw the key background
            ctx.fillRect(x, y, keyWidth, keyHeight);
            // Draw the key border
            ctx.strokeRect(x, y, keyWidth, keyHeight);
            // Draw the key label centered within the key
            const textX = x + keyWidth / 2;
            const textY = y + keyHeight / 2;
            ctx.fillStyle = '#000000'; // Reset text color
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(keyLabel, textX, textY);
        }
        // Convert the canvas to a buffer
        const imageBuffer = canvas.toBuffer('image/png');
        // Return the generated image buffer
        return imageBuffer;
    });
}
