<template>
  <section class="typing-card">
    <div v-if="englishWarning" class="warning-popup">
      ⚠️ הקלדה באנגלית - עבור לעברית
    </div>

    <div class="button-row">
      <button 
        class="nav-button stage-button" 
        :disabled="!canGoPrevStage"
        @click="$emit('prev-stage')"
        title="שלב קודם"
      >
          <!-- Swapped stage icons for RTL: was text glyphs (⏮/⏭), now Fluent inline SVG flipped for Hebrew direction -->
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 6L13 12L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 6L20 12L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
      <button 
        class="nav-button prev-button" 
        :disabled="!canGoPrev"
        @click="$emit('prev-lesson')"
        title="שיעור קודם"
      >
          <!-- Swapped lesson icons for RTL: 'שיעור קודם' shows a right-pointing Fluent chevron -->
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
      <button 
        class="reset-button" 
        @click="$emit('restart-lesson')"
        title="אפס שיעור"
      >
          <!-- Replaced reset glyph with Fluent refresh SVG for clarity (circular arc + arrow) -->
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 12a9 9 0 11-2.83-6.36" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 3v6h-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
      <button 
        class="nav-button next-button" 
        :disabled="!canGoNext"
        @click="$emit('next-lesson')"
        title="שיעור הבא"
      >
          <!-- Swapped lesson icons for RTL: 'שיעור הבא' shows a left-pointing Fluent chevron -->
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
      <button 
        :class="['nav-button','stage-button',{highlightNextStage: highlightNextStage}]" 
        :disabled="!canGoNextStage"
        @click="$emit('next-stage')"
        title="שלב הבא"
      >
          <!-- Swapped stage icons for RTL: mirrored double-chevron to indicate previous/next stage in Hebrew layout -->
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M11 6L4 12L11 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 6L13 12L20 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
    </div>

    <div class="sample-preview" dir="rtl" v-html="displayText"></div>

    <div class="input-block">
      <textarea
        id="typing-input"
        class="fluent-input"
        :value="modelValue"
        @input="onInput"
        @keydown="onKeyDown"
        @keyup="onKeyUp"
        @blur="onBlur"
        placeholder="הקלד כאן את הטקסט..."
        dir="rtl"
      ></textarea>
    </div>

    <HandGuide :next-key="nextKey" />

    <KeyboardDisplay
      :keyboard="keyboard"
      :last-key="lastKey"
      :held-key="heldKey"
      :next-key="nextKey"
      :mistake-key="mistakeKey"
    />
  </section>
</template>

<script setup lang="ts">
import KeyboardDisplay from './KeyboardDisplay.vue'
import HandGuide from './HandGuide.vue'

const props = defineProps<{
  modelValue: string
  displayText: string
  keyboard: string[][]
  lastKey: string
  heldKey: string
  nextKey: string
  mistakeKey: string
  englishWarning: boolean
  canGoPrev: boolean
  canGoNext: boolean
  canGoPrevStage: boolean
  canGoNextStage: boolean
  highlightNextStage: boolean
}>()

const emit = defineEmits(['update:modelValue', 'input', 'keydown', 'keyup', 'blur', 'prev-lesson', 'next-lesson', 'restart-lesson', 'prev-stage', 'next-stage', 'english'])

function onInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value
  
  // Check if the last character typed is English
  if (value.length > props.modelValue.length) {
    const lastChar = value[value.length - 1]
    if (/[a-zA-Z]/.test(lastChar)) {
      emit('english')
    }
  }
  
  emit('update:modelValue', value)
  emit('input')
}

function onKeyDown(e: KeyboardEvent) {
  emit('keydown', e)
}

function onKeyUp(e: KeyboardEvent) {
  emit('keyup', e)
}

function onBlur() {
  emit('blur')
}
</script>

<style scoped>
.typing-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 10px;
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  flex: 1 1 auto;
}
.sample-preview {
  color: #334155;
  line-height: 1.6;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #f9fbff;
  border: 1px solid rgba(148,163,184,0.18);
  white-space: pre-wrap;
  flex-shrink: 0;
}
:deep(.sample-preview span.current) {
  background: #fbbf24;
  color: #1f2937;
  font-weight: 500;
}
:deep(.sample-preview span.correct) {
  color: #0f766e;
}
:deep(.sample-preview span.wrong) {
  color: #b91c1c;
  text-decoration: underline wavy rgba(185,28,28,0.7);
}
.input-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 auto;
  min-height: 0;
}
.fluent-input {
  width: 100%;
  min-height: 70px;
  flex: 1 1 auto;
  resize: none;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 12px;
  border: 1px solid rgba(148,163,184,0.24);
  background: #ffffff;
  color: #0f172a;
  outline: none;
  font-family: inherit;
}
.warning-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fee2e2;
  color: #991b1b;
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: popIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 90%;
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
.fluent-input:focus {
  border-color: rgba(59,130,246,0.45);
  box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
}
.button-row {
  display: flex;
  gap: 1px;
  justify-content: center;
  flex-shrink: 0;
}
.nav-button,
.reset-button {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-size: 12px;
  cursor: pointer;
  transition: all 200ms ease;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 12px;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
}
.nav-button:hover:not(:disabled),
.reset-button:hover {
  background: #f1f5f9;
  border-color: rgba(59,130,246,0.5);
  color: #0f172a;
}
.nav-button:active:not(:disabled),
.reset-button:active {
  background: #e2e8f0;
}
.nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stage-button.highlightNextStage {
  background: linear-gradient(90deg, #2f6fed, #3b82f6);
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.18);
}
</style>
