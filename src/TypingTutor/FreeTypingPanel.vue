<template>
  <div class="free-panel">
    <textarea
      ref="inputEl"
      class="free-input"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value); $emit('input', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      placeholder="הקלד חופשי..."
      dir="rtl"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ modelValue: string }>()
defineEmits<{
  'update:modelValue': [value: string]
  input: [e: Event]
  keydown: [e: KeyboardEvent]
  keyup: [e: KeyboardEvent]
}>()

const inputEl = ref<HTMLTextAreaElement | null>(null)
defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<style scoped>
.free-panel {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.free-input {
  flex: 1 1 auto;
  min-height: 60px;
  resize: none;
  padding: 14px;
  font-size: 18px;
  line-height: 1.5;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  direction: rtl;
  transition: all 180ms ease;
  box-shadow: var(--shadow-sm);
}

.free-input:focus {
  border-color: rgba(0,120,212,0.35);
  box-shadow: inset 0 0 0 1px rgba(0,120,212,0.16), 0 2px 8px rgba(0,120,212,0.08);
}

.free-input::placeholder { color: var(--text-tertiary); }
</style>
