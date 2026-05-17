<template>
  <div class="button-row">
    <div class="phase-display" v-if="phaseLabel">{{ phaseLabel }}</div>
    <div
      v-if="sessionSecondsDisplay"
      class="session-timer"
      :class="{ 'session-timer--warn': sessionWarning }"
    >⏱ {{ sessionSecondsDisplay }}</div>
    <div class="button-group">
      <button
        class="nav-button stage-button"
        :disabled="!canGoPrevStage"
        @click="$emit('prev-stage')"
        title="שלב קודם"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M6 6L13 12L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13 6L20 12L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        class="nav-button prev-button"
        :disabled="!canGoPrev"
        @click="$emit('prev-lesson')"
        title="שיעור קודם"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        class="reset-button"
        @click="$emit('restart-lesson')"
        title="אפס שיעור"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 12a9 9 0 11-2.83-6.36" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 3v6h-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        class="nav-button next-button"
        :disabled="!canGoNext"
        @click="$emit('next-lesson')"
        title="שיעור הבא"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        :class="['nav-button','stage-button',{highlightNextStage: highlightNextStage}]"
        :disabled="!canGoNextStage"
        @click="$emit('next-stage')"
        title="שלב הבא"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M11 6L4 12L11 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 6L13 12L20 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        class="nav-button dark-toggle"
        @click="toggleDarkMode()"
        :title="isDarkMode ? 'מצב בהיר' : 'מצב אפל'"
      >
        <svg v-if="isDarkMode" class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDarkMode } from '../composables/useDarkMode'

const { isDarkMode, toggleDarkMode } = useDarkMode()

defineProps<{
  canGoPrev?: boolean
  canGoNext?: boolean
  canGoPrevStage?: boolean
  canGoNextStage?: boolean
  highlightNextStage?: boolean
  phaseLabel?: string
  sessionSecondsDisplay?: string
  sessionWarning?: boolean
}>()

defineEmits(['prev-stage', 'prev-lesson', 'restart-lesson', 'next-lesson', 'next-stage'])
</script>

<style scoped>
.button-row { 
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 6px 6px;
  background: var(--bg-secondary);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  transition: background 240ms ease, box-shadow 240ms ease, transform 180ms ease;
}

@media (max-width: 480px) {
  .button-row { 
    gap: 4px;
    padding: 5px 4px;
    border-radius: 10px;
  }
}

@media (max-height: 600px) {
  .button-row {
    gap: 3px;
    padding: 4px 3px;
    border-radius: 8px;
  }
}

.phase-display {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-primary);
  background: rgba(0, 120, 212, 0.12);
  padding: 4px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.session-timer {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--bg-tertiary);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  transition: color 300ms, background 300ms;
}

.session-timer--warn {
  color: var(--warning-color);
  background: rgba(217, 119, 6, 0.1);
}

@media (max-width: 480px) {
  .phase-display { font-size: 11px; padding: 3px 6px; }
  .session-timer { font-size: 11px; padding: 3px 6px; }
}

@media (max-height: 600px) {
  .phase-display { font-size: 10px; padding: 2px 6px; }
  .session-timer { font-size: 10px; padding: 2px 6px; }
}

.lesson-heading { 
  font-size: 13px; 
  font-weight: 700;
  color: var(--text-primary); 
  text-align: right;
  letter-spacing: -0.02em;
  transition: color 300ms ease;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .lesson-heading { 
    font-size: 12px;
  }
}

@media (max-height: 600px) {
  .lesson-heading {
    font-size: 11px;
  }
}

.button-group { 
  display: flex; 
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .button-group { 
    gap: 3px;
  }
}

@media (max-height: 600px) {
  .button-group {
    gap: 2px;
  }
}

.nav-button, .reset-button {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.nav-button::before, .reset-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--accent-primary);
  opacity: 0.08;
  transform: translate(-50%, -50%);
  transition: width 600ms ease, height 600ms ease;
}

.nav-button:hover::before, .reset-button:hover::before {
  width: 100%;
  height: 100%;
}

@media (max-width: 480px) {
  .nav-button, .reset-button { 
    width: 30px; 
    height: 30px;
    border-radius: 8px;
  }
}

@media (max-height: 600px) {
  .nav-button, .reset-button {
    width: 28px;
    height: 28px;
    border-radius: 6px;
  }
}

.icon { 
  width: 14px; 
  height: 14px; 
  display: inline-block; 
  vertical-align: middle;
  position: relative;
  z-index: 1;
}

@media (max-width: 480px) {
  .icon { 
    width: 13px; 
    height: 13px;
  }
}

@media (max-height: 600px) {
  .icon {
    width: 12px;
    height: 12px;
  }
}

.nav-button:hover:not(:disabled), .reset-button:hover {
  background: var(--bg-tertiary);
  color: var(--accent-primary);
  box-shadow: 0 18px 36px rgba(16, 20, 40, 0.08);
  border-color: rgba(0, 120, 212, 0.18);
  transform: translateY(-1px);
}

.nav-button:active:not(:disabled), .reset-button:active { 
  background: var(--accent-primary);
  color: white;
  transform: translateY(0);
  box-shadow: 0 6px 14px rgba(16, 20, 40, 0.12);
}

.nav-button:disabled { 
  opacity: 0.55; 
  cursor: not-allowed;
}

.stage-button.highlightNextStage {
  background: linear-gradient(180deg, rgba(0, 120, 212, 0.18), rgba(0, 120, 212, 0.08));
  border-color: rgba(0, 120, 212, 0.3);
  color: var(--accent-primary);
}

.dark-toggle { 
  color: var(--text-secondary);
  background: var(--bg-tertiary);
}

.dark-toggle:hover { 
  color: var(--accent-primary);
  background: var(--bg-tertiary);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-primary);
}

.highlightNextStage { 
  color: var(--success-color);
  font-weight: 700;
  background: rgba(19, 165, 56, 0.1);
}

.highlightNextStage:hover {
  background: rgba(19, 165, 56, 0.15);
  color: var(--success-color);
}
</style>
