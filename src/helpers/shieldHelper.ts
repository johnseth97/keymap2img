// src/helpers/shieldHelper.ts

import { KeyboardHalfConfig } from '../types/keyboard';
import { lily58_left_Config } from '../resources/shields/lily58_left';
import { lily58_right_Config } from '../resources/shields/lily58_right';
import logger from '../utils/logger.js';

/**
 * Processes fetched shields and returns their configurations.
 *
 * @param shields - An array of shield names fetched from GitHub.
 * @returns An array of KeyboardHalfConfig objects.
 */
export async function shieldHelper(
    shields: string[]
): Promise<KeyboardHalfConfig[]> {
    const shieldConfigs: KeyboardHalfConfig[] = [];

    for (const shield of shields) {
        if (shield === 'lily58_left') {
            shieldConfigs.push(lily58_left_Config);
            logger.debug(`Mapped shield "${shield}" to its configuration.`);
        } else if (shield === 'lily58_right') {
            shieldConfigs.push(lily58_right_Config);
            logger.debug(`Mapped shield "${shield}" to its configuration.`);
        } else {
            logger.warn(`Unknown shield configuration: ${shield}`);
            // Optionally, handle unknown shields or throw an error
        }
    }

    logger.debug(
        `Shield Configurations after mapping: ${JSON.stringify(
            shieldConfigs,
            null,
            2
        )}`
    );

    return shieldConfigs;
}
