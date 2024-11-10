// src/services/imageService.js

// Import createCanvas from the canvas module
import { createCanvas } from 'canvas';

export async function generateImage(layerData) {
    // Implement the logic to generate an image from the layerData array

    console.log('Generating image with layer data:', layerData);

    // Define canvas dimensions (adjust as needed)
    const canvasWidth = 800;
    const canvasHeight = 600;

    // Create a canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Load a font (optional)
    ctx.font = '14px ../../resources/fonts/Roboto-Regular.ttf';
    ctx.fillStyle = '#000000'; // Text color

    // Example: Draw the key labels on the canvas
    const keysPerRow = 12; // Adjust based on your keyboard layout
    const keyWidth = 60; // Adjust as needed
    const keyHeight = 60; // Adjust as needed

    for (let i = 0; i < layerData.length; i++) {
        const keyLabel = layerData[i];

        // Calculate x and y positions
        const x = (i % keysPerRow) * keyWidth;
        const y = Math.floor(i / keysPerRow) * keyHeight;

        // Draw a rectangle for the key
        ctx.strokeStyle = '#000000'; // Key border color
        ctx.strokeRect(x, y, keyWidth, keyHeight);

        // Draw the key label centered within the key
        const textX = x + keyWidth / 2;
        const textY = y + keyHeight / 2;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(keyLabel.replace('&kp', '').trim(), textX, textY);
    }

    // Convert the canvas to a buffer
    const imageBuffer = canvas.toBuffer('image/png');

    // Return the generated image buffer
    return imageBuffer;
}
