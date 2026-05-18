# Debug Tools

This folder contains debug-only components and utilities for development and calibration.

## HandSimulator

The `HandSimulator.vue` component provides an interactive tool for calibrating hand position offsets on the keyboard. It allows developers to:

- Type keys and see the hand position calculated from the keyboard layout
- Drag the hand to correct misaligned positions
- Save adjustments per finger and keyboard row
- Submit all adjustments to the backend for storage

### Enabling/Disabling

The hand simulator is controlled by `DEBUG_CONFIG.ENABLE_HAND_SIMULATOR` in `config.ts`. It's only enabled in development mode (`import.meta.env.DEV`).

To manually enable/disable:
- Edit `src/Debug/config.ts` and set `ENABLE_HAND_SIMULATOR` to `true` or `false`
- The debug button will only appear when enabled

### Usage

When enabled, a "Debug: Hand Simulator →" button appears in the top-right corner of the app. Click it to enter the simulator.

## Adding New Debug Tools

1. Create the component in this folder (e.g., `DebugTool.vue`)
2. Add a config flag in `config.ts` (e.g., `ENABLE_DEBUG_TOOL`)
3. Import and conditionally render in `App.vue` or create a debug menu
