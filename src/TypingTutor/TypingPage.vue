<template>
  <section class="typing-card">
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
      @prev-stage="onPrevStage"
      @prev-lesson="onPrevLesson"
      @restart-lesson="restartLesson"
      @next-lesson="onNextLesson"
      @next-stage="onNextStage"
    />

    <InputArea
      :model-value="typed"
      :display-text="displayText"
      :lesson-text="currentLesson?.text"
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
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NavigationButtons from './NavigationButtons.vue'
import InputArea from './InputArea.vue'
import KeyboardDisplay from './KeyboardDisplay.vue'
import HandGuide from './HandGuide.vue'
import { useTyping } from './UseTyping'

const { typed, currentLesson, displayText, nextKey, englishWarning, lastKey, heldKey, mistakeKey, restartLesson } = useTyping({ title: '', text: '' })

const canGoPrev = computed(() => false)
const canGoNext = computed(() => false)
const canGoPrevStage = computed(() => false)
const canGoNextStage = computed(() => false)
const highlightNextStage = computed(() => false)
const keyboard = ref<string[][]>([])

function onInput() {
  // Input logic here
}

function onKeyDown(e: KeyboardEvent) {
  // Key down logic here
}

function onKeyUp(e: KeyboardEvent) {
  // Key up logic here
}

function onBlur() {
  // Blur logic here
}

function onPrevStage() {
  // Previous stage logic
}

function onPrevLesson() {
  // Previous lesson logic
}

function onNextLesson() {
  // Next lesson logic
}

function onNextStage() {
  // Next stage logic
}
</script>

<style>
:root {
  direction: rtl;
  /* Light mode - Modern Fluent Design */
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

  /* Fluent-like tokens added locally (safe to edit component only) */
  --card-radius: 12px;
  --card-padding: 20px;
  --card-bg: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45));
  --card-border: rgba(16,20,24,0.04);
}

[data-theme='dark'] {
  /* Dark mode - Modern Fluent Design */
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
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 28px rgba(0, 0, 0, 0.4);
}

html {
  background: var(--bg-primary);
  transition: background 300ms ease;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 300ms ease, color 300ms ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
}
</style>

<style scoped>
.typing-card {
  background: var(--card-bg, var(--bg-primary));
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  flex: 1 1 auto;
  border: 1px solid var(--card-border);
  transition: background 300ms ease, box-shadow 300ms ease, transform 180ms ease;
}

@media (max-width: 480px) {
  .typing-card {
    padding: 12px;
    gap: 10px;
  }
}
.warning-popup { position: fixed; top:50%; left:50%; transform: translate(-50%,-50%); background:#fee2e2; color:#991b1b; border:2px solid #fca5a5; border-radius:12px; padding:20px 24px; font-size:16px; font-weight:600; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.2); z-index:1000; animation: popIn 300ms cubic-bezier(0.34,1.56,0.64,1); max-width:90% }
@keyframes popIn { from { opacity:0; transform: translate(-50%,-50%) scale(0.8) } to { opacity:1; transform: translate(-50%,-50%) scale(1) } }
</style>
