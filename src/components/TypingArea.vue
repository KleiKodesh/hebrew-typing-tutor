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
.typing-area{display:flex;flex-direction:column;gap:8px;flex:1 1 auto;min-height:0}
.typing-area textarea{width:100%;flex:1 1 auto;min-height:0;padding:8px;border-radius:10px;border:1px solid rgba(16,24,40,0.08);background:linear-gradient(180deg,#fff,#fbfdff);box-shadow:0 5px 12px rgba(16,24,40,0.04);resize:none;font-size:clamp(13px,1.8vw,14px);direction:rtl;text-align:right;overflow:auto}
.typing-area .keyboard-wrap{flex:0 0 auto;margin-top:6px}
</style>
