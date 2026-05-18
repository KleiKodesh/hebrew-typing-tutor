<template>
  <div class="input-block">
    <div class="section exercise-section">
      <div
        v-if="!isHidden"
        class="tunnel"
        ref="tunnelEl"
        dir="rtl"
        v-html="displayText"
      ></div>
      <div v-else class="sample-hidden">
        הטקסט מוסתר — הקלד מהזיכרון
      </div>
    </div>
    <textarea
      id="typing-input"
      ref="inputEl"
      class="fluent-input"
      :value="modelValue"
      @input="onInput"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @blur="onBlur"
      placeholder="הקלד כאן..."
      dir="rtl"
      autofocus
      spellcheck="false"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue?: string
  displayText?: string
  isHidden?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'input', 'keydown', 'keyup', 'blur'])

const inputEl = ref<HTMLTextAreaElement | null>(null)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  emit('input', e)
}

function onKeyDown(e: KeyboardEvent) { emit('keydown', e) }
function onKeyUp(e: KeyboardEvent)   { emit('keyup', e) }
function onBlur()                    { emit('blur') }

// ── Focus management ──────────────────────────────────────────────────────────
const focusInput = async () => {
  await nextTick()
  inputEl.value?.focus()
}

defineExpose({ focusInput })

// ── Tunnel scrolling ──────────────────────────────────────────────────────────
const tunnelEl = ref<HTMLElement | null>(null)

const ANCHOR_RATIO = 0.35

watch(
  () => props.displayText,
  async () => {
    await nextTick()
    const el = tunnelEl.value
    if (!el) return
    const current = el.querySelector<HTMLElement>('span.current')
    if (!current) {
      el.scrollLeft = 0
      return
    }

    // getBoundingClientRect is safe here: we're only SETTING scrollLeft,
    // never reading it back into the calculation — no feedback loop.
    const tunnelRect = el.getBoundingClientRect()
    const spanRect   = current.getBoundingClientRect()

    const anchorX    = tunnelRect.right - tunnelRect.width * ANCHOR_RATIO
    const spanCentreX = spanRect.left + spanRect.width / 2

    el.scrollLeft += spanCentreX - anchorX
  },
  { immediate: true }
)
</script>

<style scoped>
.input-block {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.sample-hidden {
  font-size: 14px;
  color: var(--text-tertiary);
  padding: 12px 16px;
  font-style: italic;
  text-align: center;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

/* ── Tunnel strip ── */
.tunnel {
  color: var(--text-secondary);
  font-size: 16px;
  padding: 12px 14px;
  height: 56px;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  white-space: nowrap;
  display: flex;
  align-items: center;
  scrollbar-width: none;
  direction: rtl;
}

.tunnel::-webkit-scrollbar { display: none; }

.fluent-input {
  width: 100%;
  height: 64px;
  resize: none;
  padding: 14px 14px;
  font-size: 18px;
  line-height: 1.5;
  border-radius: 0 0 8px 8px;
  border: none;
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  transition: box-shadow 180ms ease;
  overflow: hidden;
}

.fluent-input:focus {
  box-shadow: inset 0 0 0 1px rgba(0, 120, 212, 0.16);
  border-color: rgba(0, 120, 212, 0.28);
  background: var(--bg-primary);
}

.fluent-input::placeholder { color: var(--text-tertiary); }

:deep(span.current) {
  background: rgba(0, 120, 212, 0.18);
  color: var(--text-primary);
  font-weight: 600;
  border-radius: 3px;
  padding: 0.1em 0.2em;
  white-space: nowrap;
}

:deep(span.correct) {
  color: var(--success-color);
  background: rgba(16, 124, 16, 0.08);
  border-radius: 2px;
  padding: 0.08em 0.16em;
  white-space: nowrap;
}

:deep(span.wrong) {
  color: var(--error-color);
  background: rgba(232, 27, 35, 0.1);
  border-radius: 2px;
  padding: 0.08em 0.16em;
  text-decoration: underline wavy rgba(239, 68, 68, 0.28);
  white-space: nowrap;
}
</style>
