var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/controllers/imageController.js
import fetchKeymap from '../services/githubService.js';
import parseKeymap from '../services/parserService.js';
import { generateImage } from '../services/imageService.js';
//import cache from '../utils/cache.js';
import sanitize from 'sanitize-filename';
export const imageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { githubName, repoName } = req.params;
    const restOfPath = req.params[0]; // Contains keymapPath and imageName
    // Split restOfPath into keymapPath and imageName
    const pathSegments = restOfPath.split('/');
    const imageName = pathSegments.pop(); // Remove and get the last element (imageName)
    const keymapPath = pathSegments.join('/'); // Reconstruct keymapPath
    // Sanitize inputs
    const sanitizedGithubName = sanitize(githubName);
    const sanitizedRepoName = sanitize(repoName);
    const sanitizedImageName = sanitize(imageName);
    const sanitizedKeymapPath = keymapPath; // Do not sanitize to preserve slashes
    // Check for directory traversal in keymapPath
    if (sanitizedKeymapPath.includes('..')) {
        return res.status(400).send('Invalid keymap path.');
    }
    // Check cache first
    // const cacheKey = `${sanitizedGithubName}/${sanitizedRepoName}/${sanitizedKeymapPath}/${sanitizedImageName}`;
    // const cachedImage = cache.get(cacheKey);
    // if (cachedImage) {
    //    console.log('Serving from cache');
    //   res.setHeader('Content-Type', 'image/png');
    //   res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    //   return res.send(cachedImage);
    //}
    try {
        // Parse imageName: e.g., img_default_layer.png
        const imageNameWithoutExt = sanitizedImageName.replace('.png', '');
        const parts = imageNameWithoutExt.split('_');
        if (parts.length >= 2) {
            const [prefix, ...layerParts] = parts;
            const layerName = layerParts.join('_');
            console.log('prefix:', prefix);
            console.log('layerName:', layerName);
            if (prefix !== 'img' || !layerName) {
                console.error('Invalid image name format: missing components');
                return res.status(400).send('Invalid image name format.');
            }
            // Fetch keymap content from GitHub
            const keymapContent = yield fetchKeymap(sanitizedGithubName, sanitizedRepoName, sanitizedKeymapPath);
            // Parse the keymap to get layer data
            const layerData = parseKeymap(keymapContent, layerName);
            // Generate image from layer data
            const imageBuffer = yield generateImage(layerData);
            // Cache the image
            // cache.set(cacheKey, imageBuffer);
            // Set headers
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            // Send the image
            res.send(imageBuffer);
        }
        else {
            console.error('Invalid image name format: incorrect number of parts');
            return res.status(400).send('Invalid image name format.');
        }
    }
    catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).send(`Error generating image: ${error.message}`);
    }
});
export default imageController;
