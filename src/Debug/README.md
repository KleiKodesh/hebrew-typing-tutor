# Debug Tools

This folder contains debug-only components and utilities for development and calibration. **These tools are disabled by default.**

## HandSimulator

The `HandSimulator.vue` component provides an interactive tool for calibrating hand position offsets on the keyboard. It allows developers to:

- Type keys and see the hand position calculated from the keyboard layout
- Drag the hand to correct misaligned positions
- Save adjustments per finger and keyboard row
- Submit all adjustments to the backend for storage

### Enabling the Hand Simulator

To enable the hand simulator for development:

1. Open `src/Debug/config.ts`
2. Change `ENABLE_HAND_SIMULATOR` from `false` to `true`:
   ```typescript
   export const DEBUG_CONFIG = {
     ENABLE_HAND_SIMULATOR: true,  // ← Change this to true
   }
   ```
3. Save the file. The dev server will hot-reload automatically.
4. A "Debug: Hand Simulator →" button will appear in the top-right corner of the app.
5. Click it to enter the simulator.

### Using the Hand Simulator

Once enabled:

1. **Type any key** — The hand appears at the calculated position based on the keyboard layout
2. **Drag to adjust** — If the position is off, drag the hand to the correct location
3. **Save adjustments** — Press `Enter` or click "✓ Save" to save the adjustment for that finger/row
4. **Submit all** — Once you've made all adjustments, click "✓ Submit all" to send them to the backend

**Keyboard shortcuts:**
- `Enter` — Save current adjustment
- `Esc` — Reset to calculated position (discard drag)

### Disabling the Hand Simulator

To disable it again:

1. Open `src/Debug/config.ts`
2. Change `ENABLE_HAND_SIMULATOR` back to `false`
3. Save the file. The debug button will disappear.

## Adding New Debug Tools

To add more debug tools in the future:

1. Create the component in this folder (e.g., `DebugTool.vue`)
2. Add a config flag in `config.ts`:
   ```typescript
   export const DEBUG_CONFIG = {
     ENABLE_HAND_SIMULATOR: false,
     ENABLE_MY_DEBUG_TOOL: false,  // ← Add new flag
   }
   ```
3. Import and conditionally render in `App.vue`:
   ```vue
   <MyDebugTool v-else-if="debugEnabled && DEBUG_CONFIG.ENABLE_MY_DEBUG_TOOL" />
   ```
4. Document the tool in this README with setup and usage instructions

