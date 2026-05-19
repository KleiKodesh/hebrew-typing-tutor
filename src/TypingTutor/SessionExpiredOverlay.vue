<template>
  <div class="session-overlay">
    <div class="session-overlay-box">
      <div class="session-overlay-icon">⏱</div>
      <div class="session-overlay-title">20 דקות הסתיימו</div>
      <div class="session-overlay-body">
        לפי מחקר Baddeley &amp; Longman (1978), שיעור אחד ביום של עד 20 דקות הוא האפקטיבי ביותר.
        עצור כאן. חזור מחר.
      </div>
      <div class="session-overlay-actions">
        <button class="session-overlay-btn secondary" @click="$emit('dismiss')">אישור — אחזור מחר</button>
        <button class="session-overlay-btn primary" @click="$emit('continue')">המשך בכל זאת</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ dismiss: []; continue: [] }>()
</script>

<style scoped>
.session-overlay {
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

.session-overlay-box {
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

.session-overlay-icon {
  font-size: clamp(32px, 5vw, 44px);
  line-height: 1;
}

.session-overlay-title {
  font-size: clamp(17px, 2.5vw, 20px);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.session-overlay-body {
  font-size: clamp(12px, 1.8vw, 14px);
  color: var(--text-secondary);
  line-height: 1.6;
}

.session-overlay-actions {
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin-top: 4px;
}

.session-overlay-btn {
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: clamp(8px, 1.5vw, 11px) clamp(16px, 3vw, 24px);
  font-size: clamp(13px, 2vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.session-overlay-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.session-overlay-btn:active {
  transform: translateY(0);
}

.session-overlay-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
</style>
