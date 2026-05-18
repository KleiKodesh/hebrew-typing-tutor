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
    <div v-if="ayinAccuracy !== null && ayinAccuracy !== undefined" class="stat" :class="{ 'ayin-warn': (ayinAccuracy ?? 100) < 80 }">
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
  gap: clamp(8px, 1.5vw, 14px);
  padding: clamp(3px, 0.6vw, 6px) clamp(6px, 1.2vw, 10px);
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
  font-size: clamp(11px, 1.8vw, 14px);
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-value.good { color: var(--success-color); }
.stat-value.ok   { color: var(--warning-color); }
.stat-value.bad  { color: var(--error-color); }

.stat-label {
  font-size: clamp(9px, 1.3vw, 11px);
  color: var(--text-tertiary);
}

.ayin-warn .stat-value { color: var(--warning-color); }

.progress-stat {
  flex: 1 1 auto;
  gap: 6px;
}

.progress-track {
  flex: 1 1 auto;
  height: clamp(3px, 0.5vw, 5px);
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
</style>
