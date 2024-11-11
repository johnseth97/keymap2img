// src/resources/shields/lily58_right/lily58_right.ts

import { KeyboardHalfConfig } from '../../types/keyboard.js';

export const lily58_right_Config: KeyboardHalfConfig = {
    side: 'right', // Ensure this property is present
    canvasWidth: 720,
    canvasHeight: 720,
    keyWidth: 60,
    keyHeight: 60,
    keyRows: [
        {
            rowNumber: 1,
            keys: [
                { x: 0, y: 0 }, // N6
                { x: 60, y: 0 }, // N7
                { x: 120, y: 0 }, // N8
                { x: 180, y: 0 }, // N9
                { x: 240, y: 0 }, // N0
                { x: 300, y: 0 }, // GRAVE
            ],
        },
        {
            rowNumber: 2,
            keys: [
                { x: 0, y: 60 }, // Y
                { x: 60, y: 60 }, // U
                { x: 120, y: 60 }, // I
                { x: 180, y: 60 }, // O
                { x: 240, y: 60 }, // P
                { x: 300, y: 60 }, // MINUS
            ],
        },
        {
            rowNumber: 3,
            keys: [
                { x: 0, y: 120 }, // H
                { x: 60, y: 120 }, // J
                { x: 120, y: 120 }, // K
                { x: 180, y: 120 }, // L
                { x: 240, y: 120 }, // SEMI
                { x: 300, y: 120 }, // SQT
            ],
        },
        {
            rowNumber: 4,
            keys: [
                { x: 0, y: 180 }, // RBKT
                { x: 60, y: 180 }, // N
                { x: 120, y: 180 }, // M
                { x: 180, y: 180 }, // COMMA
                { x: 240, y: 180 }, // DOT
                { x: 300, y: 180 }, // FSLH
                { x: 360, y: 180 }, // RSHFT
            ],
        },
        {
            rowNumber: 5,
            keys: [
                { x: 0, y: 240 }, // RET
                { x: 60, y: 240 }, // &mo 2
                { x: 120, y: 240 }, // BSPC
                { x: 180, y: 240 }, // RGUI
            ],
        },
    ],
    // Add other configuration settings as needed
};
