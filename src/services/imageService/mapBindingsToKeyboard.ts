// src/services/imageService/mapBindingsToKeyboard.ts

import {
    Keyboard,
    KeyboardHalfConfig,
    Key,
    KeyBinding,
    KeyRow,
} from '../../types/keyboard';

import logger from '../../utils/logger.js';

/**
 * Maps layer data and shield configurations to a structured Keyboard object.
 *
 * @param layerData - An array of key bindings for the entire keyboard.
 * @param shieldConfigs - An array containing both left and right shield configurations.
 * @returns A Keyboard object representing the entire keyboard layout.
 */
export function mapBindingsToKeyboard(
    layerData: KeyBinding[],
    shieldConfigs: KeyboardHalfConfig[]
): Keyboard {
    // Initialize the Keyboard object
    const keyboard: Keyboard = {
        left: [],
        right: [],
    };

    logger.info('Starting to map bindings to keyboard structure.');

    // Iterate through each shield configuration
    for (const shieldConfig of shieldConfigs) {
        const { side, keyRows } = shieldConfig;

        logger.info(`Mapping keys for shield side: ${side}`);

        // Calculate the number of keys in this shield
        const keyCount = keyRows.reduce((acc, row) => acc + row.keys.length, 0);
        logger.info(`Number of keys to map for ${side} shield: ${keyCount}`);

        // Slice the corresponding layer data for this shield
        const shieldLayerData = layerData.slice(0, keyCount);
        // Remove the sliced data from layerData
        layerData = layerData.slice(keyCount);

        logger.info(
            `Processing ${shieldLayerData.length} key bindings for ${side} shield.`
        );

        // Map each row configuration to KeyRow objects
        const mappedRows: KeyRow[] = keyRows.map((rowConfig) => {
            const mappedKeys: Key[] = rowConfig.keys.map((position, index) => {
                const keyBinding = shieldLayerData[index];
                const label = keyBinding ? keyBinding.args.join(' ') : '';

                return {
                    label,
                    behavior: keyBinding ? keyBinding.behavior : '',
                    position,
                };
            });

            return {
                rowNumber: rowConfig.rowNumber, // Ensure 'rowNumber' is used
                keys: mappedKeys,
            };
        });

        // Assign the mapped rows to the appropriate side
        if (side === 'left') {
            keyboard.left = mappedRows;
        } else if (side === 'right') {
            keyboard.right = mappedRows;
        }

        logger.info(`Mapped ${mappedRows.length} rows for ${side} shield.`);
    }

    logger.debug(`Final Keyboard Object: ${JSON.stringify(keyboard, null, 2)}`);

    return keyboard;
}
