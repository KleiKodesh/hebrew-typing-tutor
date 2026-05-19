<template>
  <div class="recall-panel">
    <div class="recall-text" dir="rtl">{{ text }}</div>
    <button class="recall-btn" @click="$emit('start')">קראתי — הסתר והתחל</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
defineEmits<{ start: [] }>()
</script>

<style scoped>
.recall-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: clamp(10px, 2vw, 16px);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vw, 12px);
  flex-shrink: 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  animation: slideUp 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.recall-text {
  font-size: clamp(13px, 2vw, 17px);
  color: var(--text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.recall-btn {
  align-self: flex-start;
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: clamp(7px, 1.2vw, 10px) clamp(12px, 2vw, 18px);
  font-size: clamp(12px, 1.8vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.recall-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,120,212,0.2);
}

.recall-btn:active { transform: translateY(0); }
</style>
