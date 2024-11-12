// src/utils/imageUtils.ts

import { Response } from 'express';

/**
 * Sends an image buffer as a response.
 * @param res - The Express response object.
 * @param imageBuffer - The image buffer to send.
 */
export function sendImageResponse(res: Response, imageBuffer: Buffer): void {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(imageBuffer);
}
