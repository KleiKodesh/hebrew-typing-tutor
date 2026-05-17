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
.typing-area{display:flex;flex-direction:column;gap:10px;flex:1 1 auto;min-height:0}
.typing-area textarea{
  width:100%;
  flex:1 1 auto;
  min-height:0;
  padding:12px 14px;
  border-radius:12px;
  border:1px solid var(--border-subtle);
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,251,255,0.9));
  box-shadow:0 12px 30px rgba(16,24,40,0.06);
  resize:none;
  font-size:clamp(13px,1.8vw,14px);
  direction:rtl;
  text-align:right;
  overflow:auto;
  transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
}
.typing-area textarea:focus{ box-shadow:0 20px 50px rgba(16,24,40,0.08); border-color: var(--accent-primary); transform: translateY(-1px) }
.typing-area .keyboard-wrap{flex:0 0 auto;margin-top:8px}
</style>
