<template>
  <div class="stats-bar">
    <div class="stat">
      <span class="stat-value" :class="accuracyClass">{{ accuracy }}%</span>
      <span class="stat-label">דיוק</span>
    </div>
    <div class="stat">
      <span class="stat-value">{{ wpm }}</span>
      <span class="stat-label">ת/ד</span>
    </div>
    <div class="stat progress-stat">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="stat-label">{{ progress }}%</span>
    </div>
    <div v-if="ayinAccuracy !== null" class="stat" :class="{ 'ayin-warn': ayinAccuracy < 80 }">
      <span class="stat-value">{{ ayinAccuracy }}%</span>
      <span class="stat-label">ע</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  accuracy: number
  wpm: number
  progress: number
  ayinAccuracy?: number | null
}>()

const accuracyClass = computed(() => {
  if (props.accuracy >= 95) return 'good'
  if (props.accuracy >= 80) return 'ok'
  return 'bad'
})
</script>

<style scoped>
.stats-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  flex-shrink: 0;
  direction: rtl;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  transition: color 200ms;
}

.stat-value.good { color: var(--success-color); }
.stat-value.ok   { color: var(--warning-color); }
.stat-value.bad  { color: var(--error-color); }

.stat-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

.ayin-warn .stat-value { color: var(--warning-color); }

.progress-stat {
  flex: 1 1 auto;
  gap: 6px;
}

.progress-track {
  flex: 1 1 auto;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  border-radius: 2px;
  transition: width 200ms ease;
}

@media (max-width: 480px) {
  .stats-bar { gap: 8px; padding: 3px 6px; }
  .stat-value { font-size: 12px; }
  .stat-label { font-size: 9px; }
}

@media (max-height: 600px) {
  .stats-bar { padding: 2px 6px; gap: 6px; }
  .stat-value { font-size: 11px; }
}
</style>
