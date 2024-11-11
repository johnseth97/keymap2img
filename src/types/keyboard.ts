// src/types/keyboard.ts

export interface KeyBinding {
    behavior: string;
    args: string[];
}

export interface Key {
    label: string;
    behavior: string;
    position: KeyPosition;
}

export interface KeyPosition {
    x: number;
    y: number;
}

export interface KeyRow {
    rowNumber: number;
    keys: Key[];
}

export interface KeyRowConfig {
    rowNumber: number;
    keys: KeyPosition[];
}

export interface KeyboardHalfConfig {
    side: 'left' | 'right';
    canvasWidth: number;
    canvasHeight: number;
    keyWidth: number;
    keyHeight: number;
    keyRows: KeyRowConfig[];
    // Add other configuration settings as needed
}

export interface Keyboard {
    left: KeyRow[];
    right: KeyRow[];
}
