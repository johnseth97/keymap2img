// src/services/parserService.js

/**
 * Parses the ZMK keymap content to extract key bindings for a specific layer.
 * Adjusts the parsing logic based on your keymap file's structure.
 *
 * @param {string} keymapContent - The content of the keymap file.
 * @param {string} layerName - The name of the layer to extract.
 * @returns {Array} - Array of key binding objects for the specified layer.
 */
export default function parseKeymap(keymapContent, layerName) {
    console.log('Parsing keymap content...');
    console.log('Layer name:', layerName);

    // Use the layerName directly to find the layer in the keymap
    const layerRegex = new RegExp(`${layerName}\\s*\\{([\\s\\S]*?)\\}`, 'm');
    const layerMatch = keymapContent.match(layerRegex);

    if (!layerMatch) {
        throw new Error(`Layer ${layerName} not found in keymap.`);
    }

    const layerContent = layerMatch[1];

    // Extract the bindings
    const bindingsRegex = /bindings\s*=\s*<([\s\S]*?)>;/;
    const bindingsMatch = layerContent.match(bindingsRegex);

    if (!bindingsMatch) {
        throw new Error(`Bindings not found in layer ${layerName}.`);
    }

    const bindingsContent = bindingsMatch[1];

    // Tokenize the bindings
    const tokens = bindingsContent.trim().split(/[\s\n]+/);

    console.log(`Tokens:`, tokens);

    const bindings = [];
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i].startsWith('&')) {
            const behavior = tokens[i];
            i++;
            const args = [];
            while (i < tokens.length && !tokens[i].startsWith('&')) {
                args.push(tokens[i]);
                i++;
            }
            bindings.push({ behavior: behavior, args: args });
        } else {
            // Handle unexpected tokens
            console.warn(`Unexpected token: ${tokens[i]}`);
            i++;
        }
    }

    console.log(`Extracted bindings:`, bindings);

    return bindings;
}
