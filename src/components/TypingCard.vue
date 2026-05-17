<template>
  <section class="typing-card">
    <div class="sample-preview" dir="rtl" v-html="displayText"></div>

    <div class="input-block">
      <label class="input-label" for="typing-input">הקלד כאן את הטקסט...</label>
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
}>()

const emit = defineEmits(['update:modelValue', 'input', 'keydown', 'keyup', 'blur'])

function onInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value
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
.input-label {
  font-size: 13px;
  color: #64748b;
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
}
.fluent-input:focus {
  border-color: rgba(59,130,246,0.45);
  box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
}
</style>
