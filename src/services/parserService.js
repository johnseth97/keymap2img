// src/services/parserService.js

/**
 * Parses the ZMK keymap content to extract key positions and labels for a specific layer.
 * Adjusts the parsing logic based on your keymap file's structure.
 *
 * @param {string} keymapContent - The content of the keymap file.
 * @param {string} layerName - The name of the layer to extract.
 * @returns {Array} - Array of key bindings for the specified layer.
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

    // Split and clean the bindings
    const allBindings = bindingsContent.trim().split(/[\s\n]+/);

    console.log(`Extracted bindings:`, allBindings);

    // Return the bindings for further processing
    return allBindings;
}
