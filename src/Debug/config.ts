/**
 * Debug configuration
 * Controls which debug features are enabled
 */

export const DEBUG_CONFIG = {
  // Set to false to disable the hand simulator debug tool
  ENABLE_HAND_SIMULATOR: import.meta.env.DEV ?? false,
}
