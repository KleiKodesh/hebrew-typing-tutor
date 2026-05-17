<template>
  <div class="typing-card">
    <div v-if="englishWarning" class="warning-popup">
      ⚠️ הקלדה באנגלית - עבור לעברית
    </div>

    <NavigationButtons
      :lesson-title="currentLesson?.title"
      :can-go-prev="canGoPrev"
      :can-go-next="canGoNext"
      :can-go-prev-stage="canGoPrevStage"
      :can-go-next-stage="canGoNextStage"
      :highlight-next-stage="highlightNextStage"
      @prev-stage="goPrevStage"
      @prev-lesson="goPrevLesson"
      @restart-lesson="restartLesson"
      @next-lesson="goNextLesson"
      @next-stage="goNextStage"
    />

    <div v-if="currentLesson?.text" class="lesson-instructions">
      <div class="lesson-instructions-text" v-html="currentLesson.text"></div>
    </div>

    <InputArea
      :model-value="typed"
      :display-text="displayText"
      @update:modelValue="typed = $event"
      @input="onInput"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @blur="onBlur"
    />

    <HandGuide :next-key="nextKey" />

    <KeyboardDisplay
      :keyboard="keyboard"
      :last-key="lastKey"
      :held-key="heldKey"
      :next-key="nextKey"
      :mistake-key="mistakeKey"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavigationButtons from './NavigationButtons.vue'
import InputArea from './InputArea.vue'
import KeyboardDisplay from './KeyboardDisplay.vue'
import HandGuide from './HandGuide.vue'
import { useTyping } from './UseTyping'

const {
  typed,
  currentLesson,
  displayText,
  nextKey,
  englishWarning,
  lastKey,
  heldKey,
  mistakeKey,
  // navigation flags
  canGoPrev,
  canGoNext,
  canGoPrevStage,
  canGoNextStage,
  highlightNextStage,
  // navigation actions
  goPrevLesson,
  goNextLesson,
  goPrevStage,
  goNextStage,
  // other actions
  restartLesson,
  onInput,
  onKeyDown,
  onKeyUp,
} = useTyping({ title: '', text: '' })

const keyboard = ref<string[][]>([])

function onBlur() {
  // blur logic here
}
</script>

<style>
/* ── Reset: ensure the full ancestor chain has height ── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  transition: background 300ms ease;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 300ms ease, color 300ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:root {
  direction: rtl;
  --bg-primary: #ffffff;
  --bg-secondary: #f3f3f7;
  --bg-tertiary: #ececf1;
  --text-primary: #201f1e;
  --text-secondary: #3b3b3b;
  --text-tertiary: #797775;
  --border-color: #d0d0d0;
  --border-subtle: #e1dfdd;
  --accent-primary: #0078d4;
  --accent-secondary: #50e6ff;
  --success-color: #107c10;
  --warning-color: #ffd700;
  --error-color: #e81b23;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 12px 28px rgba(0, 0, 0, 0.12);
  --card-radius: 12px;
  --card-padding: 20px;
  --card-bg: var(--bg-secondary);
  --card-border: rgba(16, 20, 24, 0.08);
}

[data-theme='dark'] {
  --bg-primary: #1f1f1f;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3e3e3e;
  --text-primary: #f8f8f8;
  --text-secondary: #cccccc;
  --text-tertiary: #a0a0a0;
  --border-color: #464647;
  --border-subtle: #3f3f3f;
  --accent-primary: #0078d4;
  --accent-secondary: #50e6ff;
  --success-color: #13a538;
  --warning-color: #ffb900;
  --error-color: #f7630c;
  --card-border: rgba(255, 255, 255, 0.08);
  --card-bg: var(--bg-secondary);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 28px rgba(0, 0, 0, 0.4);
}
</style>

<style scoped>
.typing-card {
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  width: 100%;
  height: 100dvh;
  min-height: 0;
  border-radius: 0;
  padding: 14px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  transition: background 300ms ease, color 300ms ease;
}

@media (max-width: 480px) {
  .typing-card {
    padding: 12px;
    gap: 10px;
  }
}

.lesson-instructions {
  width: 100%;
  border-radius: 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  padding: 12px 14px;
  box-shadow: var(--shadow-sm);
  color: var(--text-secondary);
  line-height: 1.55;
}

.lesson-instructions-text {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

@media (max-width: 480px) {
  .lesson-instructions {
    padding: 10px 12px;
    border-radius: 12px;
  }
}

.warning-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 242, 241, 0.96);
  color: #991b1b;
  border: 1px solid rgba(252, 165, 165, 0.75);
  border-radius: 18px;
  padding: 20px 26px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  animation: popIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 90%;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.86);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>