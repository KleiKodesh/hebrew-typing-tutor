# Debug Tools

This folder contains debug-only components for development and calibration.

## HandSimulator

`HandSimulator.vue` is an interactive calibration tool for hand positions on the keyboard.

### Enabling

Controlled by `DEBUG_CONFIG.ENABLE_HAND_SIMULATOR` in `config.ts`. Only active in dev mode. A "Debug: Hand Simulator →" button appears top-right when enabled.

### How it works

Type any key — the hand SVG appears at the geometrically calculated position for that finger. If it's off, drag it to the correct spot, then press **Enter** or click **Save**. Once you've calibrated all the keys you care about, click **Submit all to server** to write the results to `hand-offsets/`.

### Space bar (special case)

Pressing Space shows **both thumbs** simultaneously — orange for left, blue for right — each independently draggable. This is because both thumbs are used for space (alternating depending on the previous key), so both need to be calibrated.

Space thumb positions are stored as **absolute `%` coordinates** (not deltas), because the thumb geometry calculation is too unreliable to use as a base. The saved `draggedLeft`/`draggedTop` values are used directly.

### Recalibrating thumbs

1. Open the simulator and press Space
2. Both thumbs appear at the last saved positions
3. Drag each to the correct spot and click Save / Enter
4. Click **Submit all to server**
5. Tell Kiro — it reads `draggedLeft`/`draggedTop` from `hand-offsets/left-thumb_row4.json` and `hand-offsets/right-thumb_row4.json` and hardcodes them into `KeyboardDisplay.vue` and `HandSimulator.vue`

### Where calibration data lives

| File | Purpose |
|------|---------|
| `hand-offsets/<finger>_row<n>.json` | Per-finger, per-row calibration data (source of truth) |
| `src/TypingTutor/KeyboardDisplay.vue` | Hardcoded absolute positions for `left-thumb` and `right-thumb` |
| `src/Debug/HandSimulator.vue` | Same hardcoded values — must stay in sync with KeyboardDisplay |

The app is built as a single self-contained HTML file (`vite-plugin-singlefile`), so calibration values must be hardcoded at build time — there is no runtime file fetch.
