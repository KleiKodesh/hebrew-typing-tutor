<template>
  <div class="input-block">
    <div class="section exercise-section">
      <div class="sample-preview" dir="rtl" v-html="displayText"></div>
    </div>
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
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
  displayText?: string
}>()

const emit = defineEmits(['update:modelValue', 'input', 'keydown', 'keyup', 'blur'])

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
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
.input-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

@media (max-width: 480px) {
  .input-block { gap: 2px; border-radius: 10px; }
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

.sample-preview {
  color: var(--text-secondary);
  font-size: 12px;
  padding: 12px 12px 10px;
  margin: 0;
  border-radius: 0;
  border: none;
  background: transparent;
  width: 100%;
  white-space: pre-wrap;
  line-height: 1.4;
  transition: color 200ms ease;
}

@media (max-width: 480px) {
  .lesson-text,
  .sample-preview {
    font-size: 11px;
    padding: 10px 10px 8px;
  }
}

.fluent-input {
  width: 100%;
  min-height: 60px;
  flex: 1 1 auto;
  resize: none;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.4;
  border-radius: 0 0 12px 12px;
  border: none;
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease, box-shadow 180ms ease;
}

.fluent-input:focus {
  box-shadow: inset 0 0 0 1px rgba(0, 120, 212, 0.16);
  border-color: rgba(0, 120, 212, 0.28);
  background: var(--bg-primary);
}

.fluent-input::placeholder {
  color: var(--text-tertiary);
}

@media (max-width: 480px) {
  .fluent-input { min-height: 52px; padding: 8px 10px; font-size: 12px; }
}

@media (max-width: 480px) {
  .sample-preview {
    font-size: 11px;
    padding: 12px 14px;
    line-height: 1.45;
  }
}

:deep(.sample-preview span.current) {
  background: rgba(0, 120, 212, 0.18);
  color: var(--text-primary);
  font-weight: 600;
  border-radius: 8px;
  padding: 0.16em 0.28em;
  border: 1px solid rgba(0, 120, 212, 0.18);
}

:deep(.sample-preview span.correct) {
  color: var(--success-color);
  background: rgba(16, 124, 16, 0.08);
  border-radius: 6px;
  padding: 0.1em 0.24em;
}

:deep(.sample-preview span.wrong) {
  color: var(--error-color);
  background: rgba(232, 27, 35, 0.1);
  border-radius: 6px;
  padding: 0.1em 0.24em;
  text-decoration: underline wavy rgba(239, 68, 68, 0.28);
}
</style>
