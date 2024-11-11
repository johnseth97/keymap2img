// src/routes/imageRoutes.ts
import express, { Request, Response } from 'express';
import { imageController } from '../controllers/imageController.js';

const router = express.Router();

/**
 * Route pattern:
 * /:githubName/:repoName/:keymapPath/path/to/keymap/:imageName.png
 *
 * Example
 * /johnseth97/lily58/config/lily58.keymap/img_default_layer.png
 * /johnseth97/lily58/config/lily58.keymap/img_default_layer_both.png
 * /johnseth97/lily58/config/lily58.keymap/img_default_layer_left.png
 * /johnseth97/lily58/config/lily58.keymap/img_default_layer_right.png
 */
router.get('/:githubName/:repoName/*/:imageName.png', imageController);

// Fallback route
router.get('/', (req: Request, res: Response) => {
    res.send(
        'Keymap2Img API is running; Usage: keymap2img.io/githubUserName/repoName/path/to/keymap/file/img_layerName.png'
    );
});

export default router;
