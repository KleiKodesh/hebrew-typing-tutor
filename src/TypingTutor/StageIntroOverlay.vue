<template>
  <div class="stage-intro-overlay" @click.self="handleBackdropClick">
    <div class="stage-intro-box" role="dialog" aria-modal="true" aria-label="מבוא לשלב">
      <div class="stage-intro-phase" v-if="phaseLabel">{{ phaseLabel }}</div>
      <div class="stage-intro-title">{{ stageTitle }}</div>
      <div v-if="stageSubtitle" class="stage-intro-subtitle">{{ stageSubtitle }}</div>
      <div class="stage-intro-body">
        <div v-if="phaseContext" class="stage-intro-context">{{ phaseContext }}</div>
      </div>
      <div class="stage-intro-actions">
        <button class="stage-intro-btn primary" @click="emitDone" @keydown.enter="emitDone">
          התחל
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stageTitle: string
  stageSubtitle?: string
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
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: clamp(20px, 4vw, 40px);
  width: 100%;
  height: 100%;
  overflow: auto;
}

.stage-intro-box {
  background: var(--bg-primary);
  border: none;
  border-radius: 0;
  padding: clamp(20px, 4vw, 40px);
  max-width: 720px;
  width: 100%;
  max-height: none;
  text-align: center;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 4vw, 32px);
  animation: pageIn 300ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes pageIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.stage-intro-phase {
  font-size: clamp(12px, 2vw, 16px);
  font-weight: 700;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.stage-intro-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stage-intro-subtitle {
  font-size: clamp(16px, 2.2vw, 22px);
  font-weight: 500;
  color: var(--accent-primary);
  line-height: 1.4;
  letter-spacing: 0.05em;
}

.stage-intro-body {
  overflow: visible;
  max-height: none;
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vw, 28px);
  padding-inline-end: 0;
  box-sizing: border-box;
}

.stage-intro-description,
.stage-intro-context {
  margin: 0;
  font-size: clamp(14px, 1.8vw, 18px);
  color: var(--text-secondary);
  line-height: 1.8;
  white-space: pre-wrap;
  text-align: justify;
  padding-inline-end: 0;
}

.stage-intro-context {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-top: 0;
}

.stage-intro-actions {
  display: flex;
  justify-content: center;
  margin-top: clamp(20px, 4vw, 32px);
}

.stage-intro-btn {
  width: auto;
  min-width: 120px;
  padding: clamp(10px, 1.5vw, 12px) clamp(24px, 3vw, 32px);
  border-radius: 12px;
  border: none;
  font-size: clamp(14px, 1.6vw, 16px);
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
  transform: translateY(2px);
}
</style>
