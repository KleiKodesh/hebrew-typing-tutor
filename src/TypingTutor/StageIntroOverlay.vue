<template>
  <div class="stage-intro-overlay" @click.self="handleBackdropClick">
    <div class="stage-intro-box" role="dialog" aria-modal="true" aria-label="מבוא לשלב">
      <div class="stage-intro-phase" v-if="phaseLabel">{{ phaseLabel }}</div>
      <div class="stage-intro-title">{{ stageTitle }}</div>
      <div class="stage-intro-body">
        <div class="stage-intro-description">{{ description }}</div>
        <div v-if="phaseContext" class="stage-intro-context">{{ phaseContext }}</div>
      </div>
      <div class="stage-intro-actions">
        <button class="stage-intro-btn primary" @click="emitDone">
          התחל
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stageTitle: string
  description: string
  phaseContext?: string
  phaseLabel?: string
}>()

const emit = defineEmits<{ done: [] }>()

function emitDone() {
  emit('done')
}

function handleBackdropClick() {
  // Prevent closing by clicking the backdrop to keep the user intentionally dismissing the intro.
}
</script>

<style scoped>
.stage-intro-overlay {
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

.stage-intro-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: clamp(20px, 3vw, 28px) clamp(18px, 2.5vw, 24px);
  max-width: 380px;
  width: 100%;
  max-height: min(84vh, 580px);
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

.stage-intro-phase {
  font-size: clamp(10px, 1.6vw, 12px);
  font-weight: 700;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.stage-intro-title {
  font-size: clamp(18px, 2.4vw, 22px);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.25;
}

.stage-intro-body {
  overflow: auto;
  max-height: 44vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-inline-end: 14px;
  box-sizing: border-box;
}

.stage-intro-description,
.stage-intro-context {
  margin: 0;
  font-size: clamp(12px, 1.8vw, 14px);
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  text-align: justify;
  padding-inline-end: 4px;
}

.stage-intro-context {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 14px 16px;
}

.stage-intro-actions {
  display: flex;
  justify-content: center;
}

.stage-intro-btn {
  width: 100%;
  padding: clamp(10px, 1.6vw, 12px) clamp(14px, 2vw, 16px);
  border-radius: 8px;
  border: none;
  font-size: clamp(13px, 1.8vw, 15px);
  font-weight: 700;
  color: #fff;
  background: var(--accent-primary);
  cursor: pointer;
  transition: opacity 150ms ease, transform 150ms ease;
}

.stage-intro-btn:hover {
  opacity: 0.92;
}

.stage-intro-btn:active {
  transform: translateY(1px);
}
</style>
