// src/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Route pattern: /:githubName/:repoName/:imageName.png
router.get('/:githubName/:repoName/:imageName.png', imageController.generateImage);

module.exports = router;

