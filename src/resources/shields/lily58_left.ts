// resources/shields/lily58_left/lily58_left.ts

import { KeyboardHalfConfig } from '../../types/keyboard.js';

export const lily58_left_Config: KeyboardHalfConfig = {
    side: 'left',
    canvasWidth: 720,
    canvasHeight: 720,
    keyWidth: 60,
    keyHeight: 60,
    keyRows: [
        {
            rowNumber: 1,
            keys: [
                { x: 0, y: 0 }, // ESC
                { x: 60, y: 0 }, // N1
                { x: 120, y: 0 }, // N2
                { x: 180, y: 0 }, // N3
                { x: 240, y: 0 }, // N4
                { x: 300, y: 0 }, // N5
            ],
        },
        {
            rowNumber: 2,
            keys: [
                { x: 0, y: 60 }, // TAB
                { x: 60, y: 60 }, // Q
                { x: 120, y: 60 }, // W
                { x: 180, y: 60 }, // E
                { x: 240, y: 60 }, // R
                { x: 300, y: 60 }, // T
            ],
        },
        {
            rowNumber: 3,
            keys: [
                { x: 0, y: 120 }, // LCTRL
                { x: 60, y: 120 }, // A
                { x: 120, y: 120 }, // S
                { x: 180, y: 120 }, // D
                { x: 240, y: 120 }, // F
                { x: 300, y: 120 }, // G
            ],
        },
        {
            rowNumber: 4,
            keys: [
                { x: 0, y: 180 }, // LSHFT
                { x: 60, y: 180 }, // Z
                { x: 120, y: 180 }, // X
                { x: 180, y: 180 }, // C
                { x: 240, y: 180 }, // V
                { x: 300, y: 180 }, // B
                { x: 360, y: 180 }, // LBKT
            ],
        },
        {
            rowNumber: 5,
            keys: [
                { x: 0, y: 240 }, // LALT
                { x: 60, y: 240 }, // LGUI
                { x: 120, y: 240 }, // &mo 1
                { x: 180, y: 240 }, // SPACE
            ],
        },
    ],
    // Add other configuration settings as needed
};
