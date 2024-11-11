// src/routes/imageRoutes.js
import express, { Request, Response } from 'express';
import { imageController } from '../controllers/imageController.js';

const router = express.Router();

// Route pattern: /:githubName/:repoName/:imageName.png
router.get('/:githubName/:repoName/*.png', imageController);

router.get('/', (req: Request, res: Response) => {
    res.send(
        'Keymap2Img API is running; Usage: keymap2img.io/githubUserName/repoName/path/to/keymap/file/img_layerName.png'
    );
});

export default router;
