# Hebrew Immersive Typing Tutor

A browser-based typing tutor for Hebrew with live keyboard visualization, hand overlays, and progress tracking.

## Quick start

1. `npm install`
2. `npm run dev`

## Key structure

- `src/KeyboardDisplay/` — reusable keyboard component, sizing, hand overlay, and shared keyboard layout helpers
- `src/TypingTutor/` — typing lesson UI and session logic
- `src/Debug/` — development tools such as the hand calibration simulator

## Notes

- The app builds as a single file via Vite
- Calibration data is stored in `hand-offsets/` and used by the debug simulator
