// src/routes/imageRoutes.js
import express from 'express';
import { imageController } from '../controllers/imageController.js';

const router = express.Router();

// Route pattern: /:githubName/:repoName/:imageName.png
router.get('/:githubName/:repoName/*', imageController);

export default router;
