<template>
  <div class="button-row">
    <div class="lesson-heading">{{ lessonTitle }}</div>
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
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 1v6m0 6v6M23 12h-6M7 12H1M20.485 3.515l-4.243 4.243M7.758 17.97l-4.243 4.243M20.485 20.485l-4.243-4.243M7.758 6.242l-4.243-4.243" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDarkMode } from '../composables/useDarkMode'

const { isDarkMode, toggleDarkMode } = useDarkMode()

defineProps<{
  lessonTitle?: string
  canGoPrev?: boolean
  canGoNext?: boolean
  canGoPrevStage?: boolean
  canGoNextStage?: boolean
  highlightNextStage?: boolean
}>()

defineEmits(['prev-stage', 'prev-lesson', 'restart-lesson', 'next-lesson', 'next-stage'])
</script>

<style scoped>
.button-row { 
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 12px;
  background: transparent;
  border-radius: 14px;
  box-shadow: none;
  border: none;
  transition: background 300ms ease, box-shadow 300ms ease, transform 180ms ease;
}

@media (max-width: 480px) {
  .button-row { 
    gap: 8px;
    padding: 10px;
    border-radius: 10px;
  }
}

.lesson-heading { 
  font-size: 16px; 
  font-weight: 600;
  color: var(--text-primary); 
  text-align: right;
  letter-spacing: -0.01em;
  transition: color 300ms ease;
}

@media (max-width: 480px) {
  .lesson-heading { 
    font-size: 14px;
  }
}

.button-group { 
  display: flex; 
  gap: 8px;
  align-items: center;
}

@media (max-width: 480px) {
  .button-group { 
    gap: 6px;
  }
}

.nav-button, .reset-button {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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
    width: 32px; 
    height: 32px;
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
    width: 12px; 
    height: 12px;
  }
}

.nav-button:hover:not(:disabled), .reset-button:hover {
  background: linear-gradient(180deg, var(--bg-tertiary), rgba(250,250,250,0.92));
  color: var(--accent-primary);
  box-shadow: 0 12px 30px rgba(16,20,24,0.08);
  border-color: rgba(0,120,212,0.12);
  transform: translateY(-2px);
}

.nav-button:active:not(:disabled), .reset-button:active { 
  background: var(--accent-primary);
  color: white;
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(16,20,24,0.08);
}

.nav-button:disabled { 
  opacity: 0.5; 
  cursor: not-allowed;
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
