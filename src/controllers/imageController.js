// src/controllers/imageController.js
const githubService = require('../services/githubService');
const parserService = require('../services/parserService');
const imageService = require('../services/imageService');
const cache = require('../utils/cache');
const sanitize = require('sanitize-filename');

exports.generateImage = async (req, res) => {
    const { githubName, repoName, imageName } = req.params;

    // Sanitize inputs
    const sanitizedGithubName = sanitize(githubName);
    const sanitizedRepoName = sanitize(repoName);
    const sanitizedImageName = sanitize(imageName);

    if (!sanitizedGithubName || !sanitizedRepoName || !sanitizedImageName) {
        return res.status(400).send('Invalid input parameters.');
    }

    // Check cache first
    const cacheKey = `${githubName}/${repoName}/${imageName}`;
    const cachedImage = cache.get(cacheKey);
    if (cachedImage) {
        console.log('Serving from cache');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(cachedImage);
    }

    try {
        // Parse imageName: e.g., img_left_layer_0
        const [prefix, side, layerPart] = imageName.split('_');
        const layerNumber = layerPart.replace('layer', '');

        if (prefix !== 'img' || !side || !layerNumber) {
            return res.status(400).send('Invalid image name format.');
        }

        // Fetch keymap content from GitHub
        const keymapContent = await githubService.fetchKeymap(
            githubName,
            repoName
        );

        // Parse the keymap to get layer data
        const layerData = parserService.parseKeymap(
            keymapContent,
            side,
            layerNumber
        );

        // Generate image from layer data
        const imageBuffer = await imageService.generateImage(layerData);

        // Cache the image
        cache.set(cacheKey, imageBuffer);

        // Set headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // Send the image
        res.send(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image.');
    }
};
