<template>
  <div class="simulator">

    <!-- ── Top: controls ── -->
    <div class="controls">
      <div class="controls-inner">
        <h3>Hand Simulator</h3>

        <div class="instructions">
          <p>Type any key — hand appears at calculated position.</p>
          <p>If off: <strong>drag</strong> to correct. <kbd>Enter</kbd> = save &nbsp;|&nbsp; <kbd>Esc</kbd> = reset</p>
        </div>

        <div class="current-key-box" v-if="currentKey">
          <div class="key-value">{{ currentKey === ' ' ? 'Space' : currentKey }}</div>
          <div class="key-meta">{{ currentFinger }} &nbsp;·&nbsp; {{ currentRowLabel }} row</div>
        </div>

        <div class="offset-box" v-if="currentKey && isDragged">
          <span>Δh: <strong>{{ deltaH.toFixed(2) }}%</strong></span>
          <span>Δv: <strong>{{ deltaV.toFixed(2) }}%</strong></span>
        </div>

        <button class="save-btn" v-if="currentKey" @click="saveAdjustment" :class="{ saved: !isDragged }">
          {{ isDragged ? '✓ Save (or Enter)' : '✓ Saved' }}
        </button>

        <div class="saved-list" v-if="savedAdjustments.length">
          <div class="saved-header">Saved ({{ savedAdjustments.length }})</div>
          <div v-for="a in savedAdjustments" :key="`${a.finger}-${a.row}`" class="saved-item">
            {{ a.finger }} / row {{ a.row }}: Δh={{ a.deltaH.toFixed(1) }} Δv={{ a.deltaV.toFixed(1) }}
          </div>
        </div>

        <button class="submit-btn" v-if="savedAdjustments.length" @click="submitAll">
          ✓ Submit all {{ savedAdjustments.length }}
        </button>
      </div>
    </div>

    <!-- ── Bottom: keyboard with hand overlay ── -->
    <div class="keyboard-area">
      <div
        class="keyboard-wrapper"
        ref="keyboardWrapper"
        tabindex="0"
        @keydown="onKeyDown"
        @keyup="onKeyUp"
        @focus="hasFocus = true"
        @click="keyboardWrapper?.focus(); hasFocus = true"
      >
        <KeyboardDisplay
          :held-key="heldKey"
          :next-key="''"
          :mistake-key="''"
          :unconstrained="true"
        />

        <div
          v-if="currentKey && currentFinger"
          class="hand-overlay"
          :style="handStyle"
          @mousedown="startDrag"
          @touchstart.prevent="startDrag"
        >
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="hand-svg">
            <path
              class="hand-base"
              :transform="handSide === 'left' ? 'scale(-1,1) translate(-32,0)' : undefined"
              d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
            />
          </svg>
        </div>
      </div>
      <div class="focus-hint" v-if="!hasFocus">Click here to start typing</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import KeyboardDisplay from '../TypingTutor/KeyboardDisplay.vue'

const keyboardWrapper = ref<HTMLElement>()
const hasFocus = ref(false)

// The actual .keyboard element rendered inside KeyboardDisplay
const kbEl = ref<HTMLElement | null>(null)
// keyboard size only (not position — we'll compute offset at render time)
const kbSize = ref({ width: 0, height: 0 })

function measureKb() {
  if (!keyboardWrapper.value) return
  const el = keyboardWrapper.value.querySelector('.keyboard') as HTMLElement | null
  if (!el) return
  kbEl.value = el
  const r = el.getBoundingClientRect()
  kbSize.value = { width: r.width, height: r.height }
}

let ro: ResizeObserver | null = null

onMounted(() => {
  keyboardWrapper.value?.focus()
  hasFocus.value = true
  nextTick(() => {
    measureKb()
    ro = new ResizeObserver(measureKb)
    if (keyboardWrapper.value) ro.observe(keyboardWrapper.value)
  })
})

onUnmounted(() => ro?.disconnect())

// ── Key state ─────────────────────────────────────────────────────────────────
const currentKey  = ref('')
const heldKey     = ref('')

function onKeyDown(e: KeyboardEvent) {
  e.preventDefault()
  hasFocus.value = true

  // Enter = save current adjustment
  if (e.key === 'Enter') {
    if (currentKey.value) saveAdjustment()
    return
  }

  // Escape = discard drag, reset to calculated
  if (e.key === 'Escape') {
    isDragged.value = false
    dragLeft.value = calculatedLeft.value
    dragTop.value  = calculatedTop.value
    return
  }

  // Ignore modifier-only keys
  if (['Shift','Control','Alt','Meta','CapsLock','Tab'].includes(e.key)) return

  // Auto-save previous if it was dragged before moving to next key
  if (currentKey.value && isDragged.value) {
    saveAdjustment()
  }

  const k = e.key === ' ' ? ' ' : e.key
  heldKey.value = k
  setKey(k)
}

function onKeyUp(e: KeyboardEvent) {
  heldKey.value = ''
}

// ── Layout constants (must match KeyboardDisplay exactly) ─────────────────────
const HAND_W = 0.28

// Finger tip positions in SVG viewBox (0–32), right hand unmirrored
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

const keyUnits: Record<string, number> = {
  Backspace: 1.5, Tab: 1.5, Caps: 1.7, Enter: 2.1,
  LShift: 1.9, Shift: 2.2, Ctrl: 1.1, Win: 1.1, Alt: 1.1, Fn: 1.0, Space: 5.5,
}

const keyboardHE: string[][] = [
  ['`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
  ['Tab', '/', '\'', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', '[{', ']}', '\\|'],
  ['Caps', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף:', '\'״', 'Enter'],
  ['LShift', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', '/?', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
]

const homeRowHE = ['Caps', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף:', '\'״', 'Enter']
const spaceRow  = ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']

const fingerHomeKey: Record<string, string> = {
  'left-pinky': 'ש', 'left-ring': 'ד', 'left-middle': 'ג', 'left-index': 'כ',
  'right-index': 'י', 'right-middle': 'ל', 'right-ring': 'ך', 'right-pinky': 'ף:',
  'thumb': 'Space',
}

function keyCenterFrac(row: string[], targetKey: string): number {
  const units = row.map(k => keyUnits[k] ?? 1)
  const total = units.reduce((a, b) => a + b, 0)
  let acc = 0
  for (let i = 0; i < row.length; i++) {
    const u = units[i]
    const k = row[i]
    if (k === targetKey || k.includes(targetKey)) return (acc + u / 2) / total
    acc += u
  }
  return 0.5
}

function fingerColumnFrac(fingerId: string, key: string): number {
  if (fingerId === 'thumb') return keyCenterFrac(spaceRow, 'Space')
  // Find the actual key in the correct keyboard row
  const row = keyRowHE[key] ?? 2
  const keyboardRow = keyboardHE[row]
  if (keyboardRow) {
    const frac = keyCenterFrac(keyboardRow, key)
    if (frac !== 0.5) return frac  // found it
  }
  // Fallback: use home key position
  const homeKey = fingerHomeKey[fingerId] ?? 'כ'
  return keyCenterFrac(homeRowHE, homeKey)
}

function rowCenterFrac(row: number): number {
  return (row + 0.5) / 5
}

// Compute hand position as % of keyboard dimensions (same formula as KeyboardDisplay)
function computeHandPos(fingerId: string, key: string, row: number, kbW: number, kbH: number) {
  const handPx = kbW * HAND_W
  const tip = FINGER_TIP[fingerId] ?? { x: 16, y: 8 }
  const tipXpx = (tip.x / 32) * handPx
  const tipYpx = (tip.y / 32) * handPx
  const targetXpx = fingerColumnFrac(fingerId, key) * kbW
  const targetYpx = rowCenterFrac(row) * kbH
  return {
    leftPct: ((targetXpx - tipXpx) / kbW) * 100,
    topPct:  ((targetYpx - tipYpx) / kbH) * 100,
  }
}

// ── Finger / row maps ─────────────────────────────────────────────────────────
// TODO: Add English layout support later (a-z, punctuation mappings)
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
  'ק': 'left-middle','ר': 'left-index',
  'א': 'left-index', 'ט': 'right-index', 'ו': 'right-index',
  'ן': 'right-middle','ם': 'right-ring',
  'פ': 'right-pinky',
  'ש': 'left-pinky', 'ד': 'left-ring',
  'ג': 'left-middle','כ': 'left-index',
  'ע': 'left-index', 'י': 'right-index',
  'ח': 'right-index','ל': 'right-middle',
  'ך': 'right-ring', 'ף': 'right-pinky',
  'ז': 'left-pinky', 'ס': 'left-ring',
  'ב': 'left-middle','ה': 'left-index',
  'נ': 'left-index', 'מ': 'right-index',
  'צ': 'right-index','ת': 'right-middle',
  'ץ': 'right-ring',
  '[': 'right-pinky',']': 'right-pinky',
  '\\': 'right-pinky','|': 'right-pinky',
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

const rowLabels: Record<number, string> = { 0: 'Number', 1: 'Top', 2: 'Home', 3: 'Bottom', 4: 'Space' }

// ── Computed position for current key ─────────────────────────────────────────
const currentFinger   = computed(() => fingerMap[currentKey.value] ?? '')
const currentRow      = computed(() => keyRowHE[currentKey.value] ?? 2)
const currentRowLabel = computed(() => rowLabels[currentRow.value] ?? '')
const handSide        = computed(() => currentFinger.value.startsWith('left') ? 'left' : 'right')

const calculatedLeft = computed(() => {
  if (!currentFinger.value || !kbSize.value.width) return 0
  return computeHandPos(currentFinger.value, currentKey.value, currentRow.value, kbSize.value.width, kbSize.value.height).leftPct
})

const calculatedTop = computed(() => {
  if (!currentFinger.value || !kbSize.value.height) return 0
  return computeHandPos(currentFinger.value, currentKey.value, currentRow.value, kbSize.value.width, kbSize.value.height).topPct
})

// ── Drag state ────────────────────────────────────────────────────────────────
const dragLeft = ref(0)
const dragTop  = ref(0)
const isDragged = ref(false)

function setKey(k: string) {
  currentKey.value = k
  isDragged.value = false
  dragLeft.value = calculatedLeft.value
  dragTop.value  = calculatedTop.value
}

const handStyle = computed(() => {
  if (!kbEl.value || kbSize.value.width === 0) return {}
  // kbEl.value.offsetLeft/Top gives position relative to its offset parent (.keyboard-wrapper)
  const kbOffsetLeft = kbEl.value.offsetLeft
  const kbOffsetTop  = kbEl.value.offsetTop
  const leftPx  = kbOffsetLeft + (dragLeft.value / 100) * kbSize.value.width
  const topPx   = kbOffsetTop  + (dragTop.value  / 100) * kbSize.value.height
  const widthPx = HAND_W * kbSize.value.width
  return {
    left:      `${leftPx}px`,
    top:       `${topPx}px`,
    width:     `${widthPx}px`,
    transform: 'none',
    bottom:    'auto',
  }
})

const deltaH = computed(() => dragLeft.value - calculatedLeft.value)
const deltaV = computed(() => dragTop.value  - calculatedTop.value)

let dragging = false
let startX = 0, startY = 0, startLeft = 0, startTop = 0

function startDrag(e: MouseEvent | TouchEvent) {
  dragging = true
  const cx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const cy = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  startX = cx; startY = cy
  startLeft = dragLeft.value; startTop = dragTop.value

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging) return
  e.preventDefault()
  const cx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const cy = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  // Deltas in keyboard-relative %
  dragLeft.value = startLeft + ((cx - startX) / kbSize.value.width)  * 100
  dragTop.value  = startTop  + ((cy - startY) / kbSize.value.height) * 100
  isDragged.value = true
}

function stopDrag() {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

// ── Saved adjustments ─────────────────────────────────────────────────────────
interface Adjustment {
  finger: string
  row: number
  rowLabel: string
  key: string
  calculatedLeft: number
  calculatedTop: number
  draggedLeft: number
  draggedTop: number
  deltaH: number
  deltaV: number
}

const savedAdjustments = ref<Adjustment[]>([])

function saveAdjustment() {
  const adj: Adjustment = {
    finger:         currentFinger.value,
    row:            currentRow.value,
    rowLabel:       currentRowLabel.value,
    key:            currentKey.value,
    calculatedLeft: calculatedLeft.value,
    calculatedTop:  calculatedTop.value,
    draggedLeft:    dragLeft.value,
    draggedTop:     dragTop.value,
    deltaH:         deltaH.value,
    deltaV:         deltaV.value,
  }
  // Replace existing entry for same finger+row
  const idx = savedAdjustments.value.findIndex(a => a.finger === adj.finger && a.row === adj.row)
  if (idx >= 0) savedAdjustments.value[idx] = adj
  else savedAdjustments.value.push(adj)
  isDragged.value = false
}

async function submitAll() {
  const payload = {
    adjustments: savedAdjustments.value,
    timestamp: new Date().toISOString(),
  }
  try {
    const res = await fetch('/api/save-hand-offsets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      alert(`✓ Saved ${savedAdjustments.value.length} adjustments`)
    } else {
      alert('✗ Failed to save')
    }
  } catch (err) {
    alert(`✗ Error: ${err}`)
  }
}
</script>

<style scoped>
.simulator {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
  box-sizing: border-box;
}

/* ── Controls (top, scrollable) ── */
.controls {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 20px 8px;
}

.controls-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.controls h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #000;
}

.instructions {
  background: #fff9e6;
  border: 1px solid #fbbf24;
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}
.instructions p { margin: 2px 0; }
kbd {
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 11px;
  font-family: monospace;
}

.current-key-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f7ff;
  border: 1px solid #0078d4;
  border-radius: 4px;
  padding: 10px 14px;
}

.key-value {
  font-size: 32px;
  font-weight: 700;
  color: #0078d4;
  line-height: 1;
  min-width: 32px;
}

.key-meta {
  font-size: 13px;
  color: #555;
}

.offset-box {
  display: flex;
  gap: 20px;
  background: #fff7ed;
  border: 1px solid #f59e0b;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 13px;
  color: #333;
}
.offset-box strong { color: #d97706; font-weight: 700; }

.save-btn {
  padding: 9px 16px;
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 200ms;
  align-self: flex-start;
}
.save-btn:hover { opacity: 0.88; }
.save-btn.saved { background: #107c10; }

.saved-header {
  font-size: 12px;
  font-weight: 600;
  color: #555;
}

.saved-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.saved-item {
  font-size: 11px;
  color: #555;
  background: #efefef;
  padding: 3px 8px;
  border-radius: 3px;
  font-family: monospace;
}

.submit-btn {
  padding: 10px 16px;
  background: #107c10;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 150ms;
  align-self: flex-start;
}
.submit-btn:hover { opacity: 0.88; }

/* ── Keyboard area (bottom, fixed height) ── */
.keyboard-area {
  flex: 0 0 auto;
  padding: 8px 20px 16px;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.keyboard-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px;
  user-select: none;
  outline: none;
}
.keyboard-wrapper:focus {
  outline: 2px solid #0078d4;
  border-radius: 4px;
}

.focus-hint {
  font-size: 12px;
  color: #999;
}

.hand-overlay {
  position: absolute;
  pointer-events: auto;
  z-index: 10;
  cursor: grab;
  transition: none;
}
.hand-overlay:active { cursor: grabbing; }

.hand-svg {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
}

.hand-base {
  fill: #0078d4;
  opacity: 0.55;
}
</style>
