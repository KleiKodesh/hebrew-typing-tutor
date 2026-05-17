<template>
  <div class="input-block">
    <div class="lesson-text" v-if="lessonText">{{ lessonText }}</div>
    <div class="sample-preview" dir="rtl" v-html="displayText"></div>
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
  lessonText?: string
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
.input-block { display:flex; flex-direction:column; gap:6px; flex:1 1 auto; min-height:0 }

@media (max-width: 480px) {
  .input-block { gap:4px }
}

.lesson-text { color:var(--text-secondary); font-size:13px; padding:8px 10px; border-radius:10px; background:transparent; border:none; white-space:pre-wrap; transition:color 200ms ease }

@media (max-width: 480px) {
  .lesson-text { font-size:12px; padding:6px 8px }
}

.sample-preview { color:var(--text-secondary); line-height: 1.6; font-size: 13px; padding: 10px 12px; border-radius: 12px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); white-space: pre-wrap; flex-shrink: 0; transition:background 200ms ease, border-color 200ms ease, color 200ms ease; box-shadow: 0 6px 18px rgba(20,24,30,0.06); }

@media (max-width: 480px) {
  .sample-preview { font-size:12px; padding:6px 8px; line-height:1.5 }
}

:deep(.sample-preview span.current) { background: #fbbf24; color: #1f2937; font-weight: 500 }
:deep(.sample-preview span.correct) { color: #10b981 }
:deep(.sample-preview span.wrong) { color: #ef4444; text-decoration: underline wavy rgba(239,68,68,0.7) }

.fluent-input { width:100%; min-height:70px; flex:1 1 auto; resize:none; padding:12px 14px; font-size:14px; line-height:1.5; border-radius:12px; border:1px solid var(--border-subtle); background:var(--bg-tertiary); color:var(--text-primary); outline:none; font-family:inherit; transition:background 200ms ease, border-color 200ms ease, color 200ms ease, box-shadow 180ms ease }

.fluent-input:focus { box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: var(--accent-primary); background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85)); }

.fluent-input::placeholder { color: rgba(32,31,30,0.45) }

@media (max-width: 480px) {
  .fluent-input { min-height:60px; padding:8px 10px; font-size:13px }
}

@media (max-width: 480px) {
  .fluent-input { min-height:60px; padding:8px 10px; font-size:13px }
}
</style>
