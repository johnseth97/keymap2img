// src/services/imageService/mapBindingsToKeyboard.ts

import {
    Keyboard,
    KeyboardHalfConfig,
    Key,
    KeyBinding,
    KeyRow,
} from '../../types/keyboard.js';
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

    logger.debug('Starting to map bindings to keyboard structure.');

    // Sort shieldConfigs by side to ensure order (left first, then right)
    shieldConfigs.sort((a, b) => a.side.localeCompare(b.side));

    // Determine the maximum number of rows across shields
    const maxRows = Math.max(
        ...shieldConfigs.map((config) => config.keyRows.length)
    );

    logger.debug(`Maximum number of rows across shields: ${maxRows}`);

    let currentBindingIndex = 0; // To track the position in layerData

    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        logger.debug(`Mapping bindings for row index: ${rowIndex + 1}`);

        for (const shieldConfig of shieldConfigs) {
            const { side, keyRows } = shieldConfig;

            if (rowIndex >= keyRows.length) {
                logger.warn(
                    `Shield "${side}" does not have row index ${rowIndex + 1}`
                );
                continue;
            }

            const rowConfig = keyRows[rowIndex];
            const { rowNumber, keys } = rowConfig;

            logger.debug(
                `Mapping row ${rowNumber} for shield "${side}" with ${keys.length} keys.`
            );

            const mappedKeys: Key[] = keys.map((position) => {
                const keyBinding = layerData[currentBindingIndex];
                const label = keyBinding ? keyBinding.args.join(' ') : '';

                const key: Key = {
                    label,
                    behavior: keyBinding ? keyBinding.behavior : '',
                    position,
                };

                currentBindingIndex++; // Move to the next binding

                return key;
            });

            const keyRow: KeyRow = {
                rowNumber: rowNumber,
                keys: mappedKeys,
            };

            if (side === 'left') {
                keyboard.left.push(keyRow);
            } else if (side === 'right') {
                keyboard.right.push(keyRow);
            }

            logger.debug(`Mapped row ${rowNumber} for shield "${side}".`);
        }
    }

    logger.debug(`Final Keyboard Object: ${JSON.stringify(keyboard, null, 2)}`);

    return keyboard;
}
