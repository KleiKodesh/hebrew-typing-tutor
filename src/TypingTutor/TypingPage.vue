<template>
  <div class="typing-card">

    <!-- ── English keyboard warning ── -->
    <div v-if="englishWarning" class="warning-popup">
      ⚠️ הקלדה באנגלית — עבור לעברית
    </div>

    <!-- ── Session expired overlay ── -->
    <div v-if="sessionExpired" class="session-overlay">
      <div class="session-overlay-box">
        <div class="session-overlay-icon">⏱</div>
        <div class="session-overlay-title">20 דקות הסתיימו</div>
        <div class="session-overlay-body">
          לפי מחקר Baddeley &amp; Longman (1978), שיעור אחד ביום של עד 20 דקות הוא האפקטיבי ביותר.
          עצור כאן. חזור מחר.
        </div>
        <div class="session-overlay-actions">
          <button class="session-overlay-btn secondary" @click="dismissExpired">אישור — אחזור מחר</button>
          <button class="session-overlay-btn primary" @click="continueAfterExpiration">המשך בכל זאת</button>
        </div>
      </div>
    </div>

    <!-- ── Lesson completion summary ── -->
    <div v-if="showSummary" class="summary-overlay">
      <div class="summary-box">
        <div class="summary-title">✓ שיעור הושלם</div>
        <div class="summary-stats">
          <div class="summary-stat">
            <span class="summary-stat-value">{{ summaryData?.accuracy }}%</span>
            <span class="summary-stat-label">דיוק</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat-value">{{ summaryData?.wpm }}</span>
            <span class="summary-stat-label">תווים/דקה</span>
          </div>
          <div v-if="summaryData?.hasAyinCheck && summaryData?.ayinAccuracy !== null" class="summary-stat" :class="{ 'ayin-warn': (summaryData?.ayinAccuracy ?? 100) < 80 }">
            <span class="summary-stat-value">{{ summaryData?.ayinAccuracy }}%</span>
            <span class="summary-stat-label">דיוק ע</span>
          </div>
        </div>
        <div v-if="summaryData?.hasAyinCheck && (summaryData?.ayinAccuracy ?? 100) < 80" class="ayin-feedback">
          הזרת הימנית (ע) מתחת ל-80% — שקול לחזור על שיעור ע לפני שממשיך.
        </div>
        <div class="summary-actions">
          <button class="summary-btn secondary" @click="dismissSummaryAndStay">חזור על השיעור</button>
          <button class="summary-btn primary" @click="dismissSummaryAndAdvance">
            {{ canGoNext ? 'שיעור הבא' : canGoNextStage ? 'שלב הבא' : 'סיום' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Navigation bar ── -->
    <NavigationButtons
      :can-go-prev="canGoPrev"
      :can-go-next="canGoNext"
      :can-go-prev-stage="canGoPrevStage"
      :can-go-next-stage="canGoNextStage"
      :highlight-next-stage="highlightNextStage"
      :phase-label="currentLesson?.phase_label"
      :session-seconds-display="sessionSecondsDisplay"
      :session-warning="sessionWarning"
      @prev-stage="goPrevStage"
      @prev-lesson="goPrevLesson"
      @restart-lesson="restartLesson"
      @next-lesson="goNextLesson"
      @next-stage="goNextStage"
    />

    <!-- ── Main content ── -->
    <div class="content-area">

      <!-- Lesson info card -->
      <div v-if="currentLesson?.text" class="lesson-info">
        <div class="lesson-content">
          <div v-if="currentLesson?.title" class="lesson-title">{{ currentLesson.title }}</div>
          <div class="lesson-text" v-html="currentLesson.text"></div>
        </div>
        <div v-if="currentLesson?.session_guidance" class="guidance-hint">
          📋 {{ currentLesson.session_guidance }}
        </div>
      </div>

      <!-- Zone progress indicator (only when multiple zones exist) -->
      <div v-if="availableZones.length > 1" class="zone-bar">
        <div
          v-for="(zone, i) in availableZones"
          :key="zone"
          class="zone-pip"
          :class="{
            'zone-pip--done': i < currentZoneIndex,
            'zone-pip--active': i === currentZoneIndex,
          }"
        >
          <span class="zone-pip-label">{{ getZoneName(zone) }}</span>
        </div>
      </div>

      <!-- Recall mode: show text → hide → type -->
      <div v-if="exerciseMode === 'recall' && !recallReady" class="recall-panel">
        <div class="recall-text" dir="rtl">{{ currentTarget }}</div>
        <button class="recall-btn" @click="startRecall">קראתי — הסתר והתחל</button>
      </div>

      <!-- Free mode: no target, just a textarea -->
      <div v-else-if="exerciseMode === 'free'" class="free-panel">
        <textarea
          class="free-input"
          v-model="typed"
          @input="onInput"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          placeholder="הקלד חופשי..."
          dir="rtl"
          autofocus
        ></textarea>
      </div>

      <!-- Copy / recall-hidden mode: exercise strip + input strip -->
      <InputArea
        v-else
        :model-value="typed"
        :display-text="displayText"
        :is-hidden="exerciseMode === 'recall' && recallHidden"
        @update:modelValue="typed = $event"
        @input="onInput"
        @keydown="onKeyDown"
        @keyup="onKeyUp"
        @blur="onBlur"
      />

    </div>

    <!-- ── Stats bar ── -->
    <StatsBar
      :accuracy="accuracy"
      :wpm="wpm"
      :progress="progress"
      :ayin-accuracy="currentLesson?.ayin_check ? ayinAccuracy : null"
    />

    <!-- ── Hand guide ── -->
    <HandGuide :next-key="nextKey" />

    <!-- ── Keyboard display ── -->
    <KeyboardDisplay
      :last-key="lastKey"
      :held-key="heldKey"
      :next-key="nextKey"
      :mistake-key="mistakeKey"
    />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NavigationButtons from './NavigationButtons.vue'
import InputArea from './InputArea.vue'
import KeyboardDisplay from './KeyboardDisplay.vue'
import HandGuide from './HandGuide.vue'
import StatsBar from './StatsBar.vue'
import { useTyping, getZoneName } from './UseTyping'

const {
  typed,
  accuracy,
  wpm,
  progress,
  lastKey,
  heldKey,
  nextKey,
  mistakeKey,
  englishWarning,
  isComplete,
  currentLesson,
  currentStage,
  displayText,
  exerciseMode,
  // zone
  currentZone,
  currentZoneIndex,
  availableZones,
  isLastZone,
  // recall
  recallReady,
  recallHidden,
  startRecall,
  // session timer
  sessionSecondsDisplay,
  sessionWarning,
  sessionExpired,
  // ayin
  ayinAccuracy,
  // summary
  showSummary,
  summaryData,
  dismissSummaryAndAdvance,
  dismissSummaryAndStay,
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
  dismissExpired,
  continueAfterExpiration,
  onInput,
  onKeyDown,
  onKeyUp,
  // current target (for recall display)
  currentTarget,
} = useTyping({ title: '', text: '' })

// expose currentTarget for recall panel
// (it's already returned from useTyping)

function onBlur() {}
</script>

<style>
*,
*::before,
*::after { box-sizing: border-box; }

html {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
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
  --warning-color: #d97706;
  --error-color: #e81b23;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
  --shadow-lg: 0 12px 28px rgba(0,0,0,0.12);
  --card-bg: var(--bg-secondary);
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
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
  --warning-color: #f59e0b;
  --error-color: #f7630c;
  --card-bg: var(--bg-secondary);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.3);
  --shadow-lg: 0 12px 28px rgba(0,0,0,0.4);
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.28); }
[data-theme='dark'] ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); }
[data-theme='dark'] ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
</style>

<style scoped>
/* ── Shell ── */
.typing-card {
  background: var(--card-bg);
  width: 100%;
  height: 100dvh;
  min-height: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

@media (max-width: 480px) { .typing-card { padding: 6px; gap: 4px; } }
@media (max-height: 600px) { .typing-card { padding: 4px; gap: 3px; } }

/* ── Content area ── */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 480px) { .content-area { gap: 6px; } }
@media (max-height: 600px) { .content-area { gap: 4px; } }

/* ── Lesson info card ── */
.lesson-info {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: clamp(8px, 1.5vw, 14px) clamp(10px, 2vw, 16px);
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 1vw, 8px);
  overflow: hidden;
  min-height: 0;
}

.lesson-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.8vw, 7px);
  overflow-y: auto;
  min-height: 0;
}

.lesson-title {
  font-size: clamp(13px, 2vw, 17px);
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
  line-height: 1.3;
}

.lesson-text {
  font-size: clamp(12px, 1.8vw, 15px);
  color: var(--text-secondary);
  white-space: pre-wrap;
  line-height: 1.55;
}

.guidance-hint {
  font-size: clamp(10px, 1.5vw, 13px);
  color: var(--text-tertiary);
  background: rgba(0,120,212,0.06);
  padding: clamp(5px, 1vw, 9px) clamp(8px, 1.5vw, 12px);
  border-radius: 6px;
  border-right: 2px solid var(--accent-primary);
  line-height: 1.4;
  flex-shrink: 0;
}

/* ── Zone progress bar ── */
.zone-bar {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  direction: rtl;
}

.zone-pip {
  flex: 1;
  height: clamp(20px, 3.5vw, 28px);
  border-radius: 5px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(9px, 1.4vw, 12px);
  font-weight: 600;
  color: var(--text-tertiary);
}

.zone-pip--active {
  background: rgba(0,120,212,0.12);
  border-color: rgba(0,120,212,0.3);
  color: var(--accent-primary);
}

.zone-pip--done {
  background: rgba(16,124,16,0.1);
  border-color: rgba(16,124,16,0.25);
  color: var(--success-color);
}

.zone-pip-label { pointer-events: none; }

/* ── Recall panel ── */
.recall-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: clamp(10px, 2vw, 16px);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vw, 12px);
  flex-shrink: 0;
}

.recall-text {
  font-size: clamp(13px, 2vw, 17px);
  color: var(--text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.recall-btn {
  align-self: flex-start;
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: clamp(7px, 1.2vw, 10px) clamp(12px, 2vw, 18px);
  font-size: clamp(12px, 1.8vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 150ms;
}

.recall-btn:hover { opacity: 0.88; }

/* ── Free mode panel ── */
.free-panel {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.free-input {
  flex: 1 1 auto;
  min-height: 60px;
  resize: none;
  padding: clamp(8px, 1.5vw, 12px);
  font-size: clamp(13px, 2vw, 16px);
  line-height: 1.5;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  direction: rtl;
  transition: border-color 180ms, box-shadow 180ms;
}

.free-input:focus {
  border-color: rgba(0,120,212,0.35);
  box-shadow: 0 0 0 2px rgba(0,120,212,0.1);
}

.free-input::placeholder { color: var(--text-tertiary); }

/* ── Session expired overlay ── */
.session-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

.session-overlay-box {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 28px 24px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-overlay-icon { font-size: clamp(28px, 5vw, 40px); }

.session-overlay-title {
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 700;
  color: var(--text-primary);
}

.session-overlay-body {
  font-size: clamp(12px, 1.8vw, 14px);
  color: var(--text-secondary);
  line-height: 1.55;
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
  border-radius: 8px;
  padding: clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px);
  font-size: clamp(13px, 2vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 150ms;
}

.session-overlay-btn:hover { opacity: 0.88; }

.session-overlay-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

/* ── Lesson summary overlay ── */
.summary-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

.summary-box {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: clamp(18px, 3vw, 28px) clamp(16px, 2.5vw, 24px);
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 16px);
}

.summary-title {
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 700;
  color: var(--success-color);
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: clamp(14px, 3vw, 24px);
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.summary-stat-value {
  font-size: clamp(20px, 3.5vw, 26px);
  font-weight: 700;
  color: var(--text-primary);
}

.summary-stat-label {
  font-size: clamp(10px, 1.5vw, 12px);
  color: var(--text-tertiary);
}

.summary-stat.ayin-warn .summary-stat-value { color: var(--warning-color); }

.ayin-feedback {
  font-size: clamp(11px, 1.6vw, 13px);
  color: var(--warning-color);
  background: rgba(217,119,6,0.08);
  padding: clamp(6px, 1vw, 10px);
  border-radius: 6px;
  line-height: 1.4;
}

.summary-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.summary-btn {
  flex: 1;
  padding: clamp(8px, 1.5vw, 11px) clamp(10px, 2vw, 14px);
  border-radius: 8px;
  font-size: clamp(12px, 1.8vw, 14px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 150ms;
}

.summary-btn:hover { opacity: 0.88; }

.summary-btn.primary {
  background: var(--accent-primary);
  color: #fff;
}

.summary-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

/* ── English warning popup ── */
.warning-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255,242,241,0.97);
  color: #991b1b;
  border: 1px solid rgba(252,165,165,0.75);
  border-radius: 16px;
  padding: clamp(12px, 2vw, 18px) clamp(16px, 3vw, 24px);
  font-size: clamp(13px, 2vw, 16px);
  font-weight: 700;
  text-align: center;
  box-shadow: var(--shadow-lg);
  z-index: 300;
  animation: popIn 280ms cubic-bezier(0.34,1.56,0.64,1);
  max-width: 88%;
}

[data-theme='dark'] .warning-popup {
  background: rgba(60,20,20,0.97);
  color: #fca5a5;
  border-color: rgba(239,68,68,0.4);
}

@keyframes popIn {
  from { opacity: 0; transform: translate(-50%,-50%) scale(0.86); }
  to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
}
</style>
