<template>
  <div class="keyboard">
    <div class="row" v-for="row in activeKeyboard" :key="row.join('')">
      <div
        class="key"
        :class="keyClasses(k)"
        :style="keyStyle(k)"
        v-for="k in row"
        :key="k"
      >
        <div v-if="isDualKey(k)" class="dual-key-content">
          <span class="shifted">{{ getShifted(k) }}</span>
          <span class="unshifted">{{ getUnshifted(k) }}</span>
        </div>
        <div v-else class="single-key-content">
          {{ displayKey(k) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  heldKey: string
  nextKey: string
  mistakeKey: string
}>()

// ─── Language detection ───────────────────────────────────────────────────────
// We can't read the OS input language directly from the browser, but we can
// infer it precisely from KeyboardEvent.key:
//
//   • When the OS is in Hebrew mode, pressing a letter key produces a Hebrew
//     character (e.g. "ש") — event.key is that Hebrew char.
//   • When in English mode, the same physical key produces "a" / "A".
//
// So we watch every keydown. The moment we see a printable char we know which
// script is active and update immediately — this fires on the very first
// character after a language toggle, with no delay.
//
// Modifier-only presses (Alt, Shift, Ctrl, Win, CapsLock…) are skipped since
// they carry no script information.

const hebrewRe = /[\u05b0-\u05ea\ufb1d-\ufb4e]/
const latinRe  = /^[a-zA-Z]$/

const lang = ref<'en' | 'he'>(
  navigator.language.startsWith('he') || navigator.language.startsWith('iw')
    ? 'he' : 'en'
)

function onKeyDown(e: KeyboardEvent) {
  if (e.key.length !== 1) return   // skip modifiers, arrows, F-keys, etc.
  if (hebrewRe.test(e.key)) lang.value = 'he'
  else if (latinRe.test(e.key))  lang.value = 'en'
  // digits / symbols are language-neutral — don't change lang
}

onMounted(()  => window.addEventListener('keydown', onKeyDown, true))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown, true))

// ─── Layouts ─────────────────────────────────────────────────────────────────
// Letter keys are single chars — no dual, no paired language.
// Only symbol/punctuation keys that have two printed faces stay dual.

const keyboardEN: string[][] = [
  ['`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[{', ']}', '\\|'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';:', '\'"', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',<', '.>', '/?', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
]

const keyboardHE: string[][] = [
  ['`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
  ['Tab', '/', 'ׁ', 'ׂ', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', '[{', ']}', '\\|'],
  ['Caps', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', ';:', '\'״', 'Enter'],
  ['Shift', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', '/?', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
]

const activeKeyboard = computed(() =>
  lang.value === 'he' ? keyboardHE : keyboardEN
)

// ─── Dual-key detection ───────────────────────────────────────────────────────
const dualSecondChars = new Set([
  '~','!','@','#','$','%','^','&','*','(',')',
  '_','+','{','}','|','"','<','>','?','\\',':','״'
])

function isDualKey(key: string): boolean {
  return key.length === 2 && dualSecondChars.has(key.charAt(1))
}

function getShifted(key: string)   { return key.charAt(1) }
function getUnshifted(key: string) { return key.charAt(0) }

// ─── Highlight logic ──────────────────────────────────────────────────────────
const wideKeys = new Set(['Backspace','Tab','Caps','Enter','Shift','Ctrl','Win','Alt','Fn','Space'])

function normalizeKey(key: string) { return key === ' ' ? 'Space' : key }
function keyMatches(key: string, value: string) {
  return normalizeKey(value) === normalizeKey(key)
}

function keyClasses(key: string) {
  return {
    held:    keyMatches(key, props.heldKey),
    next:    keyMatches(key, props.nextKey),
    mistake: keyMatches(key, props.mistakeKey),
    special: wideKeys.has(key) || key.length > 1
  }
}

// ─── Sizing ───────────────────────────────────────────────────────────────────
const keyUnits: Record<string, number> = {
  Backspace: 1.5, Tab: 1.2, Caps: 1.2, Enter: 2.0,
  Shift: 2.0, Ctrl: 1.0, Win: 1.0, Alt: 1.0, Fn: 0.9, Space: 5.5
}

function keyStyle(key: string) {
  const units = keyUnits[key] ?? 1
  return { flex: `${units} 1 0`, minWidth: `${Math.round(16 * units)}px` }
}

function displayKey(key: string) {
  if (key === 'Backspace') return '⌫'
  if (key === 'Win') return '⊞'
  return key
}
</script>

<style scoped>
.keyboard {
  margin-top: 4px;
  background: linear-gradient(to bottom, #1a1b1e, #0f1012);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #2a2d32;
  direction: ltr;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
}

.row {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  gap: 4px;
  margin-bottom: 4px;
  flex-wrap: nowrap;
  overflow-x: hidden;
}

.row:last-child { margin-bottom: 0; }

.key {
  position: relative;
  flex: 0 0 auto;
  min-width: 18px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: linear-gradient(to bottom, #1e1f22, #16171a);
  border: 1px solid #2f3338;
  font-size: 9px;
  font-weight: 600;
  color: #e5e7eb;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  padding: 0 3px;
  white-space: nowrap;
  transition: all 0.1s ease;
}

.single-key-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.dual-key-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 1px;
  line-height: 1;
}

.dual-key-content .shifted  { font-size: 7px; opacity: 0.7; }
.dual-key-content .unshifted { font-size: 8px; }

.key.special {
  border-radius: 6px;
  background: linear-gradient(to bottom, #1f2227, #17191c);
  font-size: 10px;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
}

.key.held {
  background: linear-gradient(to bottom, #1a6fff, #0f5fe2);
  color: #ffffff;
  border-color: rgba(15,95,226,0.6);
  box-shadow: 0 0 12px rgba(15,95,226,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}

.key.next {
  background: linear-gradient(to bottom, #fce8b6, #f8df97);
  color: #1f2937;
  border-color: #f59e0b;
  box-shadow: 0 0 12px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.3);
}

.key.mistake {
  background: linear-gradient(to bottom, #fecaca, #fee2e2);
  color: #991b1b;
  border-color: #ef4444;
  box-shadow: 0 0 12px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
}
</style>