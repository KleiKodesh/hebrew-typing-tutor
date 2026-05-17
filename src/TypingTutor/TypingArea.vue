<template>
  <div class="typing-area">
    <textarea
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    ></textarea>

    <div class="keyboard-wrap">
      <KeyboardDisplay :keyboard="keyboard" :last-key="lastKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import KeyboardDisplay from './KeyboardDisplay.vue'

const props = defineProps<{
  modelValue: string
  keyboard: string[][]
  lastKey: string
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue','input'])

function onInput(e: Event) {
  const v = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', v)
  emit('input')
}
</script>

<style scoped>
.typing-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
  min-height: 0;
}
.typing-area textarea {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  box-shadow: 0 10px 22px rgba(16, 24, 40, 0.05);
  resize: none;
  font-size: clamp(13px, 1.8vw, 14px);
  direction: rtl;
  text-align: right;
  overflow: auto;
  transition: box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease, background 180ms ease;
}

.typing-area textarea:focus { box-shadow: 0 16px 38px rgba(16,24,40,0.08); border-color: rgba(0, 120, 212, 0.35); transform: translateY(-1px); background: var(--bg-primary); }
.typing-area textarea:focus { box-shadow: 0 16px 38px rgba(16,24,40,0.08); border-color: rgba(0, 120, 212, 0.35); transform: translateY(-1px); background: var(--bg-primary); }
.typing-area .keyboard-wrap { flex: 0 0 auto; margin-top: 8px; }
</style>
