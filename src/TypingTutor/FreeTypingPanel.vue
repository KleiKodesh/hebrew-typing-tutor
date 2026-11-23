<template>
  <div class="free-panel">
    <textarea
      ref="inputEl"
      class="free-input"
      :class="{ 'placeholder-ltr': language === 'en' }"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value); $emit('input', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      :placeholder="placeholderText('הקלד חופשי...')"
      dir="rtl"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUiLanguage } from '../composables/useUiLanguage'

// Typed text stays RTL Hebrew; an English placeholder reads LTR.
const { t, language } = useUiLanguage()
// The box is dir=rtl for Hebrew typing. Chromium ignores 'direction' on ::placeholder,
// so an English placeholder ends with a left-to-right mark (U+200E): the trailing
// dots then stay after the words ("Type here...", not "...Type here").
const placeholderText = (he: string) => language.value === 'en' ? t(he) + '\u200E' : t(he)

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
  border-color: color-mix(in srgb, var(--accent-primary) 35%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent-primary) 16%, transparent), 0 2px 8px color-mix(in srgb, var(--accent-primary) 8%, transparent);
}

.free-input::placeholder { color: var(--text-tertiary); }
.free-input.placeholder-ltr::placeholder { text-align: left; }
</style>
