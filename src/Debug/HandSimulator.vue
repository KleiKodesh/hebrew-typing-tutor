<template>
  <div class="simulator">

    <!-- ── Controls (top, scrollable) ── -->
    <div class="controls">
      <div class="controls-inner">
        <h3>Hand Simulator</h3>

        <div class="instructions">
          <p>Type any key — hand appears at calculated position.</p>
          <p>If off: <strong>drag</strong> to correct. <kbd>Enter</kbd> = save &nbsp;|&nbsp; <kbd>Esc</kbd> = reset</p>
        </div>

        <div class="current-key-box" v-if="currentKey">
          <div class="key-value">{{ currentKey === ' ' ? 'Space' : currentKey }}</div>
          <div class="key-meta">
            <template v-if="currentKey === ' '">left-thumb &amp; right-thumb &nbsp;·&nbsp; Space row</template>
            <template v-else>{{ currentFinger }} &nbsp;·&nbsp; {{ currentRowLabel }} row</template>
          </div>
        </div>

        <div class="offset-box" v-if="currentKey !== ' ' && currentKey && isDragged">
          <span>Δh: <strong>{{ deltaH.toFixed(2) }}%</strong></span>
          <span>Δv: <strong>{{ deltaV.toFixed(2) }}%</strong></span>
        </div>

        <div class="offset-box" v-if="currentKey === ' '">
          <span>Left Δh: <strong>{{ spaceLeftDeltaH.toFixed(2) }}%</strong></span>
          <span>Left Δv: <strong>{{ spaceLeftDeltaV.toFixed(2) }}%</strong></span>
        </div>
        <div class="offset-box" v-if="currentKey === ' '">
          <span>Right Δh: <strong>{{ spaceRightDeltaH.toFixed(2) }}%</strong></span>
          <span>Right Δv: <strong>{{ spaceRightDeltaV.toFixed(2) }}%</strong></span>
        </div>

        <button class="save-btn" v-if="currentKey" @click="saveAdjustment" :class="{ saved: currentKey !== ' ' && !isDragged }">
          {{ currentKey !== ' ' && !isDragged ? '✓ Saved' : '✓ Save (or Enter)' }}
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

    <!-- ── Keyboard with hand overlay ── -->
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

        <!-- Overlay container — positioned to exactly cover the .keyboard element -->
        <div class="overlay-container" ref="overlayContainer">

          <!-- Single hand for normal keys -->
          <div
            v-if="currentKey && currentKey !== ' ' && currentFinger"
            class="hand-overlay"
            :style="handStyle"
            @mousedown="startDrag('single', $event)"
            @touchstart.prevent="startDrag('single', $event)"
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="hand-svg">
              <path
                class="hand-base"
                :transform="handSide === 'left' ? 'scale(-1,1) translate(-32,0)' : undefined"
                d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
              />
            </svg>
          </div>

          <!-- Space: left thumb (orange) + right thumb (blue), each independently draggable -->
          <template v-if="currentKey === ' '">
            <div
              class="hand-overlay"
              :style="spaceLeftStyle"
              @mousedown="startDrag('space-left', $event)"
              @touchstart.prevent="startDrag('space-left', $event)"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="hand-svg">
                <path class="hand-base hand-left" transform="scale(-1,1) translate(-32,0)"
                  d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
                />
              </svg>
            </div>
            <div
              class="hand-overlay"
              :style="spaceRightStyle"
              @mousedown="startDrag('space-right', $event)"
              @touchstart.prevent="startDrag('space-right', $event)"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="hand-svg">
                <path class="hand-base"
                  d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
                />
              </svg>
            </div>
          </template>

        </div><!-- end overlay-container -->
      </div>
      <div class="focus-hint" v-if="!hasFocus">Click here to start typing</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import KeyboardDisplay from '../TypingTutor/KeyboardDisplay.vue'
import {
  KEYBOARD_HE,
  KEY_UNITS,
  FINGER_MAP,
  KEY_ROW_HE,
  HAND_W,
  computeHandPos,
} from '../TypingTutor/HebrewKeyboard'

// ── DOM refs ──────────────────────────────────────────────────────────────────
const keyboardWrapper  = ref<HTMLElement>()
const overlayContainer = ref<HTMLElement>()
const hasFocus         = ref(false)
const kbSize           = ref({ width: 0, height: 0 })

function positionOverlay() {
  if (!keyboardWrapper.value || !overlayContainer.value) return
  const kb = keyboardWrapper.value.querySelector('.keyboard') as HTMLElement | null
  if (!kb) return
  const kbRect   = kb.getBoundingClientRect()
  const wrapRect = keyboardWrapper.value.getBoundingClientRect()
  overlayContainer.value.style.left   = `${kbRect.left - wrapRect.left}px`
  overlayContainer.value.style.top    = `${kbRect.top  - wrapRect.top}px`
  overlayContainer.value.style.width  = `${kbRect.width}px`
  overlayContainer.value.style.height = `${kbRect.height}px`
  kbSize.value = { width: kbRect.width, height: kbRect.height }
}

let ro: ResizeObserver | null = null

onMounted(() => {
  keyboardWrapper.value?.focus()
  hasFocus.value = true
  nextTick(() => {
    positionOverlay()
    ro = new ResizeObserver(positionOverlay)
    if (keyboardWrapper.value) ro.observe(keyboardWrapper.value)
  })
})

onUnmounted(() => ro?.disconnect())

// ── Key state ─────────────────────────────────────────────────────────────────
const currentKey = ref('')
const heldKey    = ref('')

function onKeyDown(e: KeyboardEvent) {
  e.preventDefault()
  hasFocus.value = true

  if (e.key === 'Enter') { if (currentKey.value) saveAdjustment(); return }
  if (e.key === 'Escape') {
    if (currentKey.value === ' ') {
      spaceLeftLeft.value  = spaceCalcLeft.value.leftPct
      spaceLeftTop.value   = spaceCalcLeft.value.topPct
      spaceRightLeft.value = spaceCalcRight.value.leftPct
      spaceRightTop.value  = spaceCalcRight.value.topPct
    } else {
      isDragged.value = false
      dragLeft.value  = calculatedLeft.value
      dragTop.value   = calculatedTop.value
    }
    return
  }
  if (['Shift','Control','Alt','Meta','CapsLock','Tab'].includes(e.key)) return

  if (currentKey.value && isDragged.value) saveAdjustment()

  const k = e.key === ' ' ? ' ' : e.key
  heldKey.value = k
  setKey(k)
}

function onKeyUp() { heldKey.value = '' }

// ── Row labels ────────────────────────────────────────────────────────────────
const ROW_LABELS: Record<number, string> = {
  0: 'Number', 1: 'Top', 2: 'Home', 3: 'Bottom', 4: 'Space',
}

// ── Computed position for current key ─────────────────────────────────────────
const currentFinger   = computed(() => FINGER_MAP[currentKey.value] ?? '')
const currentRow      = computed(() => KEY_ROW_HE[currentKey.value] ?? 2)
const currentRowLabel = computed(() => ROW_LABELS[currentRow.value] ?? '')
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
const dragLeft  = ref(0)
const dragTop   = ref(0)
const isDragged = ref(false)

const spaceLeftLeft  = ref(0)
const spaceLeftTop   = ref(0)
const spaceRightLeft = ref(0)
const spaceRightTop  = ref(0)

const spaceCalcLeft  = computed(() => computeHandPos('left-thumb',  ' ', 4, kbSize.value.width, kbSize.value.height))
const spaceCalcRight = computed(() => computeHandPos('right-thumb', ' ', 4, kbSize.value.width, kbSize.value.height))

const spaceLeftDeltaH  = computed(() => spaceLeftLeft.value  - spaceCalcLeft.value.leftPct)
const spaceLeftDeltaV  = computed(() => spaceLeftTop.value   - spaceCalcLeft.value.topPct)
const spaceRightDeltaH = computed(() => spaceRightLeft.value - spaceCalcRight.value.leftPct)
const spaceRightDeltaV = computed(() => spaceRightTop.value  - spaceCalcRight.value.topPct)

function pctStyle(leftPct: number, topPct: number) {
  return { left: `${leftPct}%`, top: `${topPct}%`, width: `${HAND_W * 100}%`, transform: 'none', bottom: 'auto' }
}

const spaceLeftStyle  = computed(() => pctStyle(spaceLeftLeft.value,  spaceLeftTop.value))
const spaceRightStyle = computed(() => pctStyle(spaceRightLeft.value, spaceRightTop.value))

function setKey(k: string) {
  currentKey.value = k
  isDragged.value  = false
  dragLeft.value   = calculatedLeft.value
  dragTop.value    = calculatedTop.value
  if (k === ' ') {
    spaceLeftLeft.value  = spaceCalcLeft.value.leftPct
    spaceLeftTop.value   = spaceCalcLeft.value.topPct
    spaceRightLeft.value = spaceCalcRight.value.leftPct
    spaceRightTop.value  = spaceCalcRight.value.topPct
  }
}

const handStyle = computed(() => pctStyle(dragLeft.value, dragTop.value))
const deltaH    = computed(() => dragLeft.value - calculatedLeft.value)
const deltaV    = computed(() => dragTop.value  - calculatedTop.value)

// ── Drag interaction ──────────────────────────────────────────────────────────
let dragging = false
let startX = 0, startY = 0, startLeft = 0, startTop = 0
let dragMode: 'single' | 'space-left' | 'space-right' = 'single'

function startDrag(mode: 'single' | 'space-left' | 'space-right', e: MouseEvent | TouchEvent) {
  dragging  = true
  dragMode  = mode
  const cx  = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const cy  = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  startX = cx; startY = cy
  if (mode === 'single')       { startLeft = dragLeft.value;       startTop = dragTop.value }
  else if (mode === 'space-left') { startLeft = spaceLeftLeft.value;  startTop = spaceLeftTop.value }
  else                         { startLeft = spaceRightLeft.value; startTop = spaceRightTop.value }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mouseup',   stopDrag)
  document.addEventListener('touchend',  stopDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging) return
  e.preventDefault()
  const cx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const cy = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  const dx = ((cx - startX) / kbSize.value.width)  * 100
  const dy = ((cy - startY) / kbSize.value.height) * 100
  if (dragMode === 'single') {
    dragLeft.value  = startLeft + dx
    dragTop.value   = startTop  + dy
    isDragged.value = true
  } else if (dragMode === 'space-left') {
    spaceLeftLeft.value = startLeft + dx
    spaceLeftTop.value  = startTop  + dy
  } else {
    spaceRightLeft.value = startLeft + dx
    spaceRightTop.value  = startTop  + dy
  }
}

function stopDrag() {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup',   stopDrag)
  document.removeEventListener('touchend',  stopDrag)
}

// ── Saved adjustments ─────────────────────────────────────────────────────────
interface Adjustment {
  finger: string; row: number; rowLabel: string; key: string
  calculatedLeft: number; calculatedTop: number
  draggedLeft: number; draggedTop: number
  deltaH: number; deltaV: number
}

const savedAdjustments = ref<Adjustment[]>([])

function saveAdjustment() {
  if (currentKey.value === ' ') {
    const entries: Adjustment[] = [
      {
        finger: 'left-thumb', row: 4, rowLabel: 'Space', key: ' ',
        calculatedLeft: spaceCalcLeft.value.leftPct,
        calculatedTop:  spaceCalcLeft.value.topPct,
        draggedLeft:    spaceLeftLeft.value,
        draggedTop:     spaceLeftTop.value,
        deltaH:         spaceLeftDeltaH.value,
        deltaV:         spaceLeftDeltaV.value,
      },
      {
        finger: 'right-thumb', row: 4, rowLabel: 'Space', key: ' ',
        calculatedLeft: spaceCalcRight.value.leftPct,
        calculatedTop:  spaceCalcRight.value.topPct,
        draggedLeft:    spaceRightLeft.value,
        draggedTop:     spaceRightTop.value,
        deltaH:         spaceRightDeltaH.value,
        deltaV:         spaceRightDeltaV.value,
      },
    ]
    for (const adj of entries) {
      const idx = savedAdjustments.value.findIndex(a => a.finger === adj.finger && a.row === adj.row)
      if (idx >= 0) savedAdjustments.value[idx] = adj
      else savedAdjustments.value.push(adj)
    }
    return
  }

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
  const idx = savedAdjustments.value.findIndex(a => a.finger === adj.finger && a.row === adj.row)
  if (idx >= 0) savedAdjustments.value[idx] = adj
  else savedAdjustments.value.push(adj)
  isDragged.value = false
}

async function submitAll() {
  const payload = { adjustments: savedAdjustments.value, timestamp: new Date().toISOString() }
  try {
    const res = await fetch('/api/save-hand-offsets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    alert(res.ok ? `✓ Saved ${savedAdjustments.value.length} adjustments` : '✗ Failed to save')
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

/* ── Controls ── */
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

.controls h3 { margin: 0; font-size: 17px; font-weight: 700; color: #000; }

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

.key-value { font-size: 32px; font-weight: 700; color: #0078d4; line-height: 1; min-width: 32px; }
.key-meta  { font-size: 13px; color: #555; }

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

.saved-list { display: flex; flex-direction: column; gap: 3px; }
.saved-header { font-size: 12px; font-weight: 600; color: #555; }
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

/* ── Keyboard area ── */
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
.keyboard-wrapper:focus { outline: 2px solid #0078d4; border-radius: 4px; }

.focus-hint { font-size: 12px; color: #999; }

.hand-overlay {
  position: absolute;
  pointer-events: auto;
  z-index: 10;
  cursor: grab;
  transition: none;
}
.hand-overlay:active { cursor: grabbing; }

.overlay-container {
  position: absolute;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
}

.hand-svg {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
}

.hand-base { fill: #0078d4; opacity: 0.55; }
.hand-left { fill: #e05c00; opacity: 0.55; }
</style>
