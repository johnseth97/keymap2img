// src/utils/parsingUtils.ts

import logger from './logger.js';

type ImageType = 'both' | 'left' | 'right' | 'default';

/**
 * Parses the image name to extract prefix, layer name, and image type.
 * @param imageName - The sanitized image name.
 * @returns An object containing prefix, layerName, and imageType.
 */
export function parseImageName(imageName: string) {
    const imageNameWithoutExt = imageName.replace('.png', '');
    const parts = imageNameWithoutExt.split('_');

    if (parts.length < 3) {
        logger.error('Invalid image name format: not enough parts');
        throw new Error('Invalid image name format.');
    }

    const prefix = parts[0];
    let layerName = parts.slice(1, parts.length - 1).join('_');
    let imageType: ImageType = 'default';

    const lastPart = parts[parts.length - 1].toLowerCase();
    if (['both', 'left', 'right'].includes(lastPart)) {
        imageType = lastPart as ImageType;
    } else {
        layerName = parts.slice(1).join('_');
        imageType = 'both';
    }

    logger.debug(
        `Parsed Image Name - Prefix: ${prefix}, Layer Name: ${layerName}, Image Type: ${imageType}`
    );

    return { prefix, layerName, imageType };
}
