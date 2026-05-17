<template>
  <div class="keyboard-wrap" ref="wrapEl">
    <div class="keyboard" ref="keyboardEl" :style="{ maxWidth: kbMaxWidth }">
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

      <!-- ── Hand overlay — inside .keyboard so % coords are relative to it ── -->
      <div v-if="handOverlay" class="hand-overlay" :style="handOverlay.style" :class="handOverlay.side">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="hand-svg">
          <path
            class="hand-base"
            :transform="handOverlay.side === 'left' ? 'scale(-1,1) translate(-32,0)' : undefined"
            d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  heldKey: string
  nextKey: string
  mistakeKey: string
  unconstrained?: boolean
}>()

// ─── Language detection ───────────────────────────────────────────────────────
const hebrewRe = /[\u05b0-\u05ea\ufb1d-\ufb4e]/
const latinRe  = /^[a-zA-Z]$/

const lang = ref<'en' | 'he'>('he')

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
  ['LShift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',<', '.>', '/?', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
]

const keyboardHE: string[][] = [
  ['`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
  ['Tab', '/', '\'', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', '[{', ']}', '\\|'],
  ['Caps', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף:', '\'״', 'Enter'],
  ['LShift', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', '/?', 'Shift'],
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
const wideKeys = new Set(['Backspace','Tab','Caps','Enter','LShift','Shift','Ctrl','Win','Alt','Fn','Space'])

function normalizeKey(key: string) {
  if (key === ' ') return 'Space'
  if (key === 'LShift') return 'Shift'
  return key
}
function keyMatches(key: string, value: string) {
  return normalizeKey(value) === normalizeKey(key)
}

function keyClasses(key: string) {
  return {
    held:    keyMatches(key, props.heldKey),
    next:    keyMatches(key, props.nextKey),
    mistake: keyMatches(key, props.mistakeKey),
    active:  keyMatches(key, props.nextKey) || keyMatches(key, props.heldKey) || keyMatches(key, props.mistakeKey),
    special: wideKeys.has(key) || (key.length > 1 && !isDualKey(key))
  }
}

// ─── Sizing ───────────────────────────────────────────────────────────────────
const keyUnits: Record<string, number> = {
  Backspace: 1.5, Tab: 1.5, Caps: 1.7, Enter: 2.1,
  LShift: 1.9, Shift: 2.4, Ctrl: 1.1, Win: 1.1, Alt: 1.1, Fn: 1.0, Space: 5.5
}

function keyStyle(key: string) {
  const units = keyUnits[key] ?? 1
  return { flex: `${units} ${units} 0` }
}

function displayKey(key: string) {
  if (key === 'Backspace') return '⌫'
  if (key === 'LShift') return 'Shift'
  return key
}

// ─── Hand overlay — fully dynamic ────────────────────────────────────────────
//
// Finger tip positions in SVG viewBox (0–32), right hand unmirrored.
// Left hand mirrors X: leftX = 32 - rightX
const HAND_W = 0.28

const FINGER_TIP: Record<string, { x: number; y: number }> = {
  'right-pinky':  { x: 29.5, y: 8.7  },
  'right-ring':   { x: 22.2, y: 3.4  },
  'right-middle': { x: 14.5, y: 2.6  },
  'right-index':  { x: 6.9,  y: 7.7  },
  'right-thumb':  { x: 2.9,  y: 26.8 },
  'left-pinky':   { x: 32 - 29.5, y: 8.7  },
  'left-ring':    { x: 32 - 22.2, y: 3.4  },
  'left-middle':  { x: 32 - 14.5, y: 2.6  },
  'left-index':   { x: 32 - 6.9,  y: 7.7  },
  'left-thumb':   { x: 32 - 2.9,  y: 26.8 },
}

// Calibrated hand left% per finger per row (from simulator draggedLeft)
// Row 2 (home) is the primary calibration; other rows from actual drag data
const fingerRowLeft: Record<string, Record<number, number>> = {
  'left-pinky':  { 0:  8.11, 1: 10.51, 2: 10.51, 3: 12.81, 4:  3.51 },
  'left-ring':   { 0:  9.10, 1: 10.87, 2: 11.07, 3: 13.81, 4: 11.07 },
  'left-middle': { 0:  9.02, 1: 11.66, 2: 11.48, 3: 14.90, 4: 11.48 },
  'left-index':  { 0: 18.37, 1: 20.91, 2: 21.94, 3: 24.58, 4: 21.94 },
  'right-index': { 0: 45.60, 1: 48.18, 2: 41.48, 3: 52.80, 4: 41.48 },
  'right-middle':{ 0: 46.07, 1: 48.42, 2: 48.62, 3: 53.13, 4: 48.62 },
  'right-ring':  { 0: 46.42, 1: 48.63, 2: 49.03, 3: 54.22, 4: 49.03 },
  'right-pinky': { 0: 46.25, 1: 48.89, 2: 48.79, 3: 55.07, 4: 48.79 },
  'thumb':       { 0: 48.40, 1: 48.40, 2: 48.40, 3: 48.40, 4: 48.40 },
}

// Calibrated vertical positions per finger per row (draggedTop values from simulator)
const fingerRowTop: Record<string, Record<number, number>> = {
  'left-pinky':  { 0:  0.97, 1: 16.60, 2: 31.54, 3: 45.17, 4: 65.52 },
  'left-ring':   { 0:  2.36, 1: 32.79, 2: 48.60, 3: 58.13, 4: 75.00 },
  'left-middle': { 0:  4.13, 1:  9.54, 2: 51.96, 3: 61.78, 4: 77.00 },
  'left-index':  { 0:-10.62, 1:  8.91, 2: 28.91, 3: 48.91, 4: 28.91 },
  'right-index': { 0:-10.15, 1: 20.01, 2: 40.68, 3: 48.91, 4: 62.00 },
  'right-middle':{ 0:  2.72, 1:  9.54, 2: 51.11, 3: 62.72, 4: 77.00 },
  'right-ring':  { 0:  1.89, 1: 31.94, 2: 49.40, 3: 60.48, 4: 75.00 },
  'right-pinky': { 0:-12.48, 1: 21.64, 2: 32.36, 3: 45.64, 4: 60.00 },
  'thumb':       { 0:  6.79, 1:  6.79, 2:  6.79, 3:  6.79, 4:  6.79 },
}

// DOM refs
const wrapEl     = ref<HTMLElement>()
const keyboardEl = ref<HTMLElement>()
const kbWidth  = ref(0)
const kbHeight = ref(0)
const kbMaxWidth = ref<string>('100%')
const ASPECT = 3.2
const MAX_HEIGHT_FRAC = 0.28

function measureConstraints() {
  if (props.unconstrained) {
    kbMaxWidth.value = '100%'
    return
  }
  if (!wrapEl.value) return
  const parent = wrapEl.value.parentElement
  if (!parent) return
  const parentH = parent.getBoundingClientRect().height
  const maxW = parentH * MAX_HEIGHT_FRAC * ASPECT
  kbMaxWidth.value = `${maxW}px`
}

function measureKeyboard() {
  if (!keyboardEl.value) return
  const r = keyboardEl.value.getBoundingClientRect()
  kbWidth.value  = r.width
  kbHeight.value = r.height
}

let ro: ResizeObserver | null = null
onMounted(() => {
  measureConstraints()
  measureKeyboard()
  ro = new ResizeObserver(() => {
    measureConstraints()
    measureKeyboard()
  })
  if (wrapEl.value?.parentElement) ro.observe(wrapEl.value.parentElement)
  if (keyboardEl.value) ro.observe(keyboardEl.value)
})
onUnmounted(() => ro?.disconnect())

// Compute key center X as fraction of keyboard width (same flex-unit math as before)
function keyCenterFrac(row: string[], targetKey: string): number {
  const units = row.map(k => keyUnits[k] ?? 1)
  const total = units.reduce((a, b) => a + b, 0)
  let acc = 0
  for (let i = 0; i < row.length; i++) {
    const u = units[i]
    const k = row[i]
    if (k === targetKey || k.includes(targetKey)) {
      return (acc + u / 2) / total
    }
    acc += u
  }
  return 0.5
}

// Row Y centers as fraction of keyboard height.
// The keyboard has 5 rows of equal height (gap is small, treat as uniform).
// Row index 0=number, 1=top, 2=home, 3=bottom, 4=space
// With 5 rows: center of row i = (i + 0.5) / 5
function rowCenterFrac(row: number): number {
  return (row + 0.5) / 5
}

const fingerHomeKey: Record<string, string> = {
  'left-pinky': 'ש', 'left-ring': 'ד', 'left-middle': 'ג', 'left-index': 'כ',
  'right-index': 'י', 'right-middle': 'ל', 'right-ring': 'ך', 'right-pinky': 'ף',
  'thumb': 'Space',
}
const fingerHomeKeyEN: Record<string, string> = {
  'left-pinky': 'a', 'left-ring': 's', 'left-middle': 'd', 'left-index': 'f',
  'right-index': 'j', 'right-middle': 'k', 'right-ring': 'l', 'right-pinky': ';:',
  'thumb': 'Space',
}

const homeRowHE = ['Caps', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף:', '\'״', 'Enter']
const homeRowEN = ['Caps', 'a',  's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';:', '\'"',  'Enter']
const spaceRow  = ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']

function fingerColumnFrac(fingerId: string, isHebrew: boolean): number {
  if (fingerId === 'thumb') return keyCenterFrac(spaceRow, 'Space')
  const homeRow = isHebrew ? homeRowHE : homeRowEN
  const homeKey = isHebrew ? (fingerHomeKey[fingerId] ?? 'ף') : (fingerHomeKeyEN[fingerId] ?? ';:')
  return keyCenterFrac(homeRow, homeKey)
}

// Finger map: key → finger id
const fingerMap: Record<string, string> = {
  '`': 'left-pinky', '~': 'left-pinky',
  '1': 'left-pinky', '!': 'left-pinky',
  '2': 'left-ring',  '@': 'left-ring',
  '3': 'left-middle','#': 'left-middle',
  '4': 'left-index', '$': 'left-index',
  '5': 'left-index', '%': 'left-index',
  '6': 'right-index','^': 'right-index',
  '7': 'right-index','&': 'right-index',
  '8': 'right-middle','*': 'right-middle',
  '9': 'right-ring', '(': 'right-ring',
  '0': 'right-pinky',')': 'right-pinky',
  '-': 'right-pinky','_': 'right-pinky',
  '=': 'right-pinky','+': 'right-pinky',
  '/': 'left-pinky', "'": 'left-ring',
  'ק': 'left-middle','ר': 'left-index',
  'א': 'left-index', 'ט': 'right-index', 'ו': 'right-index',
  'ן': 'right-middle','ם': 'right-ring',
  'פ': 'right-pinky','ך': 'right-ring',
  'ף': 'right-pinky',']': 'right-pinky',
  '[': 'right-pinky','\\': 'right-pinky',
  'ש': 'left-pinky', 'ד': 'left-ring',
  'ג': 'left-middle','כ': 'left-index',
  'ע': 'left-index', 'י': 'right-index',
  'ח': 'right-index',
  'ז': 'left-pinky', 'ס': 'left-ring',
  'ב': 'left-middle','ה': 'left-index',
  'נ': 'left-index', 'מ': 'right-index',
  'צ': 'right-index','ת': 'right-middle',
  'ץ': 'right-ring', '.': 'right-pinky',
  ',': 'right-pinky',
  ' ': 'thumb',
}

const keyRowHE: Record<string, number> = {
  '`':0,'~':0,'1':0,'!':0,'2':0,'@':0,'3':0,'#':0,'4':0,'$':0,'5':0,'%':0,
  '6':0,'^':0,'7':0,'&':0,'8':0,'*':0,'9':0,'(':0,'0':0,')':0,'-':0,'_':0,'=':0,'+':0,
  '/':1,"'":1,'ק':1,'ר':1,'א':1,'ט':1,'ו':1,'ן':1,'ם':1,'פ':1,']':1,'[':1,'\\':1,
  'ש':2,'ד':2,'ג':2,'כ':2,'ע':2,'י':2,'ח':2,'ל':2,'ך':2,'ף':2,
  'ז':3,'ס':3,'ב':3,'ה':3,'נ':3,'מ':3,'צ':3,'ת':3,'ץ':3,'.':3,',':3,
  ' ':4,
}
const keyRowEN: Record<string, number> = {
  '`':0,'~':0,'1':0,'!':0,'2':0,'@':0,'3':0,'#':0,'4':0,'$':0,'5':0,'%':0,
  '6':0,'^':0,'7':0,'&':0,'8':0,'*':0,'9':0,'(':0,'0':0,')':0,'-':0,'_':0,'=':0,'+':0,
  'q':1,'w':1,'e':1,'r':1,'t':1,'y':1,'u':1,'i':1,'o':1,'p':1,'[':1,']':1,'\\':1,
  'a':2,'s':2,'d':2,'f':2,'g':2,'h':2,'j':2,'k':2,'l':2,';':2,"'":2,
  'z':3,'x':3,'c':3,'v':3,'b':3,'n':3,'m':3,',':3,'.':3,'/':3,
  ' ':4,
}

const handOverlay = computed(() => {
  const key = props.nextKey
  if (!key || !kbWidth.value || !kbHeight.value) return null
  const fingerId = fingerMap[key]
  if (!fingerId) return null

  const side = fingerId.startsWith('left') ? 'left' : 'right'
  const isHebrew = lang.value === 'he'
  const rowMap = isHebrew ? keyRowHE : keyRowEN
  const row = rowMap[key] ?? 2

  // Horizontal: calibrated left% for this finger + row
  const leftPct = fingerRowLeft[fingerId]?.[row] ?? fingerRowLeft['left-pinky']?.[row] ?? 10

  // Vertical: calibrated top% for this finger/row
  const topPct = fingerRowTop[fingerId]?.[row] ?? fingerRowTop['left-pinky']?.[row] ?? 30

  return {
    side,
    style: {
      left:   `${leftPct}%`,
      top:    `${topPct}%`,
      width:  `${HAND_W * 100}%`,
      bottom: 'auto',
      transform: 'none',
    }
  }
})
</script>

<style scoped>
.keyboard-wrap {
  width: 100%;
  margin: 2px auto 0 auto;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.keyboard {
  background: var(--bg-secondary);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 4px;
  border-radius: 1px;
  border: 1px solid var(--border-subtle);
  direction: ltr;
  width: 100%;
  /* ~3.2:1 keyboard aspect ratio — height grows/shrinks with width */
  aspect-ratio: 3.2 / 1;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.row {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: nowrap;
  flex: 1 1 0;
  min-height: 0;
}

.row:last-child { margin-bottom: 0; }

.key {
  flex: 1 1 0;
  min-width: 0;
  width: 0;
  height: 100%;
  margin-right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  background: rgba(236, 237, 244, 0.85);
  border: 0.5px solid rgba(192, 194, 204, 0.7);
  font-size: clamp(7px, 1.6vw, 9px);
  font-weight: 500;
  color: var(--text-primary);
  box-shadow: none;
  padding: 0 1px;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  transition: transform 180ms ease;
  cursor: default;
  user-select: none;
  letter-spacing: 0.01em;
}

[data-theme='dark'] .key {
  background: rgba(236, 237, 244, 0.12);
  border-color: rgba(192, 194, 204, 0.18);
}

.row .key {
  margin-right: 2px;
}


.key.active {
  opacity: 0.85;
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

.dual-key-content .shifted   { font-size: clamp(6px, 1.5vw, 8px); opacity: 0.55; }
.dual-key-content .unshifted { font-size: clamp(8px, 1.9vw, 10px); }

.key.special {
  background: rgba(236, 237, 244, 0.95);
  border-color: rgba(192, 194, 204, 0.85);
  color: #4a4c5a;
  font-weight: 500;
}

[data-theme='dark'] .key.special {
  background: rgba(236, 237, 244, 0.18);
  border-color: rgba(192, 194, 204, 0.28);
  color: #b0b0d0;
}

.key.held {
  background: #3b82f6;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: none;
}

.key.next {
  background: #fef9c3;
  border-color: #fbbf24;
  color: #92400e;
  box-shadow: none;
}

.key.mistake {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
  box-shadow: none;
}

.win-icon {
  width: clamp(8px, 1.9vw, 12px);
  height: clamp(8px, 1.9vw, 12px);
  display: block;
}

/* ── Hand overlay ── */
.hand-overlay {
  position: absolute;
  pointer-events: none;
  transition: left 180ms ease, top 180ms ease;
  z-index: 10;
}

.hand-svg {
  width: 100%;
  height: auto;
  display: block;
}

.hand-base {
  fill: var(--text-secondary);
  opacity: 0.45;
}

[data-theme='dark'] .hand-base {
  opacity: 0.50;
}
</style>
