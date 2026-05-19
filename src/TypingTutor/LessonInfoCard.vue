<template>
  <div class="lesson-info">
    <div class="lesson-content">
      <div v-if="title" class="lesson-title" :key="`title-${lessonId}`">
        {{ title }}
      </div>
      <div class="lesson-text" :key="`text-${lessonId}`">
        {{ text }}
      </div>
    </div>
    <div v-if="guidance" class="guidance-hint">
      📋 {{ guidance }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lessonId?: string
  title?: string
  text: string
  guidance?: string
}>()
</script>

<style scoped>
.lesson-info {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: clamp(8px, 1.5vw, 14px) clamp(10px, 2vw, 16px);
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 1vw, 8px);
  overflow: hidden;
  min-height: 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 240ms ease;
}

.lesson-info:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.08); }

.lesson-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.8vw, 7px);
  overflow-y: auto;
  min-height: 0;
}

.lesson-title {
  font-size: clamp(13px, 2vw, 17px);
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.lesson-text {
  font-size: clamp(12px, 1.8vw, 15px);
  color: var(--text-secondary);
  white-space: pre-wrap;
  line-height: 1.55;
}

.guidance-hint {
  font-size: clamp(10px, 1.5vw, 13px);
  color: var(--text-secondary);
  background: rgba(0,120,212,0.08);
  padding: clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px);
  border-radius: 6px;
  border-right: 2px solid var(--accent-primary);
  line-height: 1.5;
  flex-shrink: 0;
  transition: background 200ms ease;
}

.guidance-hint:hover { background: rgba(0,120,212,0.12); }
</style>
