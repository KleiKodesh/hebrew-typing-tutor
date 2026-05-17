<template>
  <section class="typing-card">
    <div v-if="englishWarning" class="warning-popup">
      ⚠️ הקלדה באנגלית - עבור לעברית
    </div>

    <div class="button-row">
      <button 
        class="nav-button prev-button" 
        :disabled="!canGoPrev"
        @click="$emit('prev-lesson')"
        title="שיעור קודם"
      >
        ❮
      </button>
      <button 
        class="reset-button" 
        @click="$emit('restart-lesson')"
        title="אפס שיעור"
      >
        ⟲
      </button>
      <button 
        class="nav-button next-button" 
        :disabled="!canGoNext"
        @click="$emit('next-lesson')"
        title="שיעור הבא"
      >
        ❯
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
}>()

const emit = defineEmits(['update:modelValue', 'input', 'keydown', 'keyup', 'blur', 'prev-lesson', 'next-lesson', 'restart-lesson', 'english'])

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
  padding: 14px;
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sample-preview {
  color: #334155;
  line-height: 1.7;
  font-size: 14px;
  padding: 12px 10px;
  border-radius: 16px;
  background: #f9fbff;
  border: 1px solid rgba(148,163,184,0.18);
  white-space: pre-wrap;
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
  gap: 8px;
}
.fluent-input {
  width: 100%;
  min-height: 116px;
  resize: none;
  padding: 12px 14px;
  font-size: 15px;
  line-height: 1.6;
  border-radius: 14px;
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
  gap: 6px;
  justify-content: center;
}
.nav-button,
.reset-button {
  padding: 5px 10px;
  border: 1px solid rgba(148,163,184,0.24);
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  cursor: pointer;
  transition: all 200ms ease;
  font-weight: 600;
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
</style>
