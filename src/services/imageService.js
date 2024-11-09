// src/services/imageService.js
const { createCanvas } = require('canvas');

exports.generateImage = async (layerData) => {
  const { keys } = layerData;

  // Define image dimensions. Adjust based on your keyboard layout.
  const canvasWidth = 800;
  const canvasHeight = 400;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw each key
  keys.forEach((key) => {
    // Draw key rectangle
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(key.x, key.y, key.width, key.height);

    // Draw key border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(key.x, key.y, key.width, key.height);

    // Draw key label
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      key.label,
      key.x + key.width / 2,
      key.y + key.height / 2
    );
  });

  // Optional: Add layer title or other annotations
  ctx.fillStyle = '#000000';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Layer View', 50, 10);

  return canvas.toBuffer('image/png');
};

