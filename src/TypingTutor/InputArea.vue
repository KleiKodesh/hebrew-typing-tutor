<template>
  <div class="input-block">
    <div class="section exercise-section">
      <div
        v-if="!isHidden"
        class="sample-preview"
        dir="rtl"
        v-html="displayText"
      ></div>
      <div v-else class="sample-hidden">
        הטקסט מוסתר — הקלד מהזיכרון
      </div>
    </div>
    <textarea
      id="typing-input"
      class="fluent-input"
      :value="modelValue"
      @input="onInput"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @blur="onBlur"
      placeholder="הקלד כאן..."
      dir="rtl"
      autofocus
    ></textarea>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
  displayText?: string
  isHidden?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'input', 'keydown', 'keyup', 'blur'])

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  emit('input', e)
}

function onKeyDown(e: KeyboardEvent) { emit('keydown', e) }
function onKeyUp(e: KeyboardEvent)   { emit('keyup', e) }
function onBlur()                    { emit('blur') }
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
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 6px 8px;
  font-style: italic;
  text-align: center;
  height: 24px;
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

.sample-preview {
  color: var(--text-secondary);
  font-size: 12px;
  padding: 6px 8px;
  margin: 0;
  border-radius: 0;
  border: none;
  background: transparent;
  width: 100%;
  white-space: nowrap;
  line-height: 1.4;
  transition: color 200ms ease;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 24px;
  display: flex;
  align-items: center;
}

@media (max-width: 480px) {
  .sample-preview {
    font-size: 11px;
    padding: 5px 8px;
    height: 22px;
  }
}

@media (max-height: 600px) {
  .sample-preview {
    font-size: 11px;
    padding: 4px 6px;
    height: 20px;
  }
}

.fluent-input {
  width: 100%;
  height: 32px;
  resize: none;
  padding: 6px 8px;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 0 0 8px 8px;
  border: none;
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease, box-shadow 180ms ease;
  overflow: hidden;
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
  .fluent-input { 
    height: 30px; 
    padding: 5px 8px; 
    font-size: 11px; 
  }
}

@media (max-height: 600px) {
  .fluent-input {
    height: 28px;
    padding: 4px 6px;
    font-size: 11px;
    border-radius: 0 0 6px 6px;
  }
}

:deep(.sample-preview span.current) {
  background: rgba(0, 120, 212, 0.18);
  color: var(--text-primary);
  font-weight: 600;
  border-radius: 3px;
  padding: 0.1em 0.2em;
  white-space: nowrap;
}

:deep(.sample-preview span.correct) {
  color: var(--success-color);
  background: rgba(16, 124, 16, 0.08);
  border-radius: 2px;
  padding: 0.08em 0.16em;
  white-space: nowrap;
}

:deep(.sample-preview span.wrong) {
  color: var(--error-color);
  background: rgba(232, 27, 35, 0.1);
  border-radius: 2px;
  padding: 0.08em 0.16em;
  text-decoration: underline wavy rgba(239, 68, 68, 0.28);
  white-space: nowrap;
}
</style>
