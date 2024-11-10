// src/routes/imageRoutes.js
import express from 'express';
import { imageController } from '../controllers/imageController.js';

const router = express.Router();

// Route pattern: /:githubName/:repoName/:imageName.png
router.get('/:githubName/:repoName/*', imageController);

router.get('/', (req, res) => {
    res.send(
        'Keymap2Img API is running; Usage: keymap2img.io/githubUserName/repoName/path/to/keymap/file/img_layerName.png'
    );
});

export default router;
