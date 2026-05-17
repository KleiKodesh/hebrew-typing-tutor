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
          <svg v-if="k === 'Win'" class="win-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12.5v6.7l8.1 1.2v-7.9M10.1 3.7L2 4.9v6.7h8.1M21.9 11.5V2L11.1 3.6v8M11.1 20.5L21.9 22v-9.5H11.1"/>
          </svg>
          <template v-else>{{ displayKey(k) }}</template>
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
const hebrewRe = /[\u05b0-\u05ea\ufb1d-\ufb4e]/
const latinRe  = /^[a-zA-Z]$/

const lang = ref<'en' | 'he'>(
  navigator.language.startsWith('he') || navigator.language.startsWith('iw')
    ? 'he' : 'en'
)

function onKeyDown(e: KeyboardEvent) {
  if (e.key.length !== 1) return
  if (hebrewRe.test(e.key)) lang.value = 'he'
  else if (latinRe.test(e.key)) lang.value = 'en'
}

onMounted(()  => window.addEventListener('keydown', onKeyDown, true))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown, true))

// ─── Layouts ─────────────────────────────────────────────────────────────────
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
  Backspace: 1.5, Tab: 1.3, Caps: 1.3, Enter: 2.1,
  Shift: 2.2, Ctrl: 1.1, Win: 1.1, Alt: 1.1, Fn: 1.0, Space: 5.5
}

function keyStyle(key: string) {
  const units = keyUnits[key] ?? 1
  // flex-grow and flex-shrink both proportional — keys scale together on any width
  return { flex: `${units} ${units} 0`, minWidth: '0' }
}

function displayKey(key: string) {
  if (key === 'Backspace') return '⌫'
  return key
}
</script>

<style scoped>
.keyboard {
  margin: 4px auto 0 auto;
  background: var(--bg-secondary);
  padding: 6px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  direction: ltr;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  transition: background 200ms ease, border-color 200ms ease;
}

@media (max-width: 480px) {
  .keyboard {
    padding: 4px;
    max-width: 100%;
  }
}

.row {
  display: flex;
  width: 100%;
  gap: 3px;
  margin-bottom: 3px;
  flex-wrap: nowrap;
}

@media (max-width: 480px) {
  .row {
    gap: 2px;
    margin-bottom: 2px;
  }
}

.row:last-child { margin-bottom: 0; }

.key {
  flex: 1 1 0;
  min-width: 0;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  font-size: clamp(7px, 1.1vw, 11px);
  font-weight: 500;
  color: var(--text-primary);
  box-shadow: 0 2px 0 var(--border-color);
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.08s, box-shadow 0.08s, color 0.08s;
  cursor: default;
  user-select: none;
  letter-spacing: 0.01em;
}

@media (max-width: 480px) {
  .key {
    height: 16px;
    border-radius: 5px;
    font-size: clamp(6px, 1vw, 9px);
    box-shadow: 0 1px 0 var(--border-color);
  }
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

.dual-key-content .shifted   { font-size: clamp(6px, 0.9vw, 9px); opacity: 0.55; }
.dual-key-content .unshifted { font-size: clamp(6px, 1vw, 10px); }

@media (max-width: 480px) {
  .dual-key-content .shifted   { font-size: clamp(5px, 0.8vw, 7px); }
  .dual-key-content .unshifted { font-size: clamp(5px, 0.9vw, 8px); }
}

.key.special {
  background: #ecedf4;
  border-color: #c0c2cc;
  color: #4a4c5a;
  font-weight: 500;
}

[data-theme='dark'] .key.special {
  background: #404060;
  border-color: #505080;
  color: #b0b0d0;
}

.key.held {
  background: #3b82f6;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 0 #1d4ed8;
}

.key.next {
  background: #fef9c3;
  border-color: #fbbf24;
  color: #92400e;
  box-shadow: 0 2px 0 #f59e0b;
}


.key.mistake {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
  box-shadow: 0 2px 0 #ef4444;
}

.win-icon {
  width: clamp(8px, 1.2vw, 12px);
  height: clamp(8px, 1.2vw, 12px);
  display: block;
}
</style>