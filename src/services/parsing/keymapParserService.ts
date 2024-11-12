// src/services/parserService.ts

import logger from '../../utils/logger.js';
import { KeyBinding } from '../../types/keyboard.js';

/**
 * Parses the ZMK keymap content to extract key bindings for a specific layer.
 *
 * @param keymapContent - The content of the keymap file.
 * @param layerName - The name of the layer to extract.
 * @returns An array of key binding objects for the specified layer.
 */
export default function parseKeymap(keymapContent: string, layerName: string) {
    logger.debug('Parsing keymap content...');
    logger.debug(`Layer name: ${layerName}`);

    // Remove comments (assuming C-like comments)
    const uncommentedContent = keymapContent
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

    // Use the layerName to find the layer in the keymap
    const layerRegex = new RegExp(`${layerName}\\s*\\{([\\s\\S]*?)\\}`, 'm');
    const layerMatch = uncommentedContent.match(layerRegex);

    if (!layerMatch) {
        throw new Error(`Layer "${layerName}" not found in keymap.`);
    }

    const layerContent = layerMatch[1];

    // Extract the bindings
    const bindingsRegex = /bindings\s*=\s*<([\s\S]*?)>;/;
    const bindingsMatch = layerContent.match(bindingsRegex);

    if (!bindingsMatch) {
        throw new Error(`Bindings not found in layer "${layerName}".`);
    }

    const bindingsContent = bindingsMatch[1];

    // Tokenize the bindings, handling commas and whitespace
    const tokens = bindingsContent
        .replace(/,/g, ' ') // Replace commas with spaces
        .trim()
        .split(/\s+/); // Split by any whitespace

    logger.debug(`Tokens: ${tokens}`);

    const bindings: KeyBinding[] = [];
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i].startsWith('&')) {
            const behavior = tokens[i];
            i++;
            const args: string[] = [];
            while (i < tokens.length && !tokens[i].startsWith('&')) {
                args.push(tokens[i]);
                i++;
            }
            bindings.push({ behavior, args });
        } else {
            // Handle unexpected tokens
            logger.warn(`Unexpected token: "${tokens[i]}"`);
            i++;
        }
    }

    logger.debug(`Extracted bindings: ${JSON.stringify(bindings, null, 2)}`);

    return bindings;
}
