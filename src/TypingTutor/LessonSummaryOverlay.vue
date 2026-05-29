<template>
  <div class="summary-overlay">
    <div class="summary-box">
      <div class="summary-title">{{ title }}</div>
      <div v-if="data.wpm > 0 || data.accuracy < 100" class="summary-stats">
        <div class="summary-stat">
          <span class="summary-stat-value">{{ data.accuracy }}%</span>
          <span class="summary-stat-label">דיוק</span>
        </div>
        <div class="summary-stat">
          <span class="summary-stat-value">{{ data.wpm }}</span>
          <span class="summary-stat-label">תווים/דקה</span>
        </div>
        <div
          v-if="data.hasAyinCheck && data.ayinAccuracy !== null"
          class="summary-stat"
          :class="{ 'ayin-warn': (data.ayinAccuracy ?? 100) < 80 }"
        >
          <span class="summary-stat-value">{{ data.ayinAccuracy }}%</span>
          <span class="summary-stat-label">דיוק ע</span>
        </div>
      </div>
      <div v-if="data.hasAyinCheck && (data.ayinAccuracy ?? 100) < 80" class="ayin-feedback">
        הזרת הימנית (ע) מתחת ל-80% — שקול לחזור על שיעור ע לפני שממשיך.
      </div>
      <div class="summary-actions">
        <button class="summary-btn secondary" @click="$emit('stay')">{{ stayLabel ?? 'חזור על השיעור' }}</button>
        <button class="summary-btn primary" @click="$emit('advance')" @keydown.enter="$emit('advance')">
          {{ advanceLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  advanceLabel: string
  stayLabel?: string
  data: {
    accuracy: number
    wpm: number
    ayinAccuracy: number | null
    timeUsedMs: number
    hasAyinCheck: boolean
  }
}>()

defineEmits<{ stay: []; advance: [] }>()
</script>

<style scoped>
.summary-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
}

.summary-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: clamp(20px, 3vw, 28px) clamp(18px, 2.5vw, 24px);
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 1px 2px rgba(0,0,0,0.06),
    0 4px 12px rgba(0,0,0,0.08),
    0 16px 40px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 16px);
  animation: cardIn 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.97) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.summary-title {
  font-size: clamp(17px, 2.5vw, 20px);
  font-weight: 600;
  color: var(--success-color);
  letter-spacing: -0.02em;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: clamp(16px, 3vw, 28px);
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-stat-value {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.summary-stat-label {
  font-size: clamp(10px, 1.5vw, 12px);
  color: var(--text-tertiary);
  font-weight: 500;
}

.summary-stat.ayin-warn .summary-stat-value { color: var(--warning-color); }

.ayin-feedback {
  font-size: clamp(11px, 1.6vw, 13px);
  color: var(--warning-color);
  background: rgba(217,119,6,0.08);
  padding: clamp(8px, 1.2vw, 12px) clamp(10px, 1.5vw, 14px);
  border-radius: 6px;
  border-right: 2px solid var(--warning-color);
  line-height: 1.5;
}

.summary-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 4px;
}

.summary-btn {
  flex: 1;
  padding: clamp(8px, 1.5vw, 11px) clamp(12px, 2vw, 16px);
  border-radius: 6px;
  font-size: clamp(12px, 1.8vw, 14px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 150ms ease;
}

.summary-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.summary-btn:active { transform: translateY(0); }

.summary-btn.primary {
  background: var(--accent-primary);
  color: #fff;
}

.summary-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
</style>
