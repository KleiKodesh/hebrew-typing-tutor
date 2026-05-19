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
        <div class="summary-title">{{ summaryTitle }}</div>
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
      :lesson-stage-label="lessonStageLabel"
      @prev-stage="goPrevStage"
      @prev-lesson="goPrevLesson"
      @restart-lesson="restartLesson"
      @next-lesson="goNextLesson"
      @next-stage="goNextStage"
      @show-intro="emit('show-intro')"
      @new-user="emit('new-user')"
      @reset-all="handleResetLesson"
    />

    <!-- ── Main content ── -->
    <div class="content-area">

      <!-- Lesson info card -->
      <div v-if="currentLesson?.text" class="lesson-info">
        <div class="lesson-content" ref="lessonContentEl">
          <div v-if="currentLesson?.title" class="lesson-title" :key="`title-${currentLesson.lesson_id}`">
            {{ currentLesson.title }}
          </div>
          <div class="lesson-text" :key="`text-${currentLesson.lesson_id}`">
            {{ currentLesson.text }}
          </div>
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
          ref="freeInputRef"
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
        ref="inputAreaRef"
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

    <!-- ── Keyboard display ── -->
    <KeyboardDisplay
      :last-key="lastKey"
      :held-key="heldKey"
      :next-key="nextKey"
      :prev-key="lastKey"
      :mistake-key="mistakeKey"
    />

    <!-- ── Reset confirmation dialog ── -->
    <ConfirmDialog
      :is-open="showResetConfirm"
      cancel-label="ביטול"
      confirm-label="מחק הכל"
      @confirm="confirmReset"
      @cancel="showResetConfirm = false"
    >
      <template #message>
        האם אתה בטוח שברצונך למחוק את כל הנתונים?
      </template>
      <template #warning>
        לא ניתן לבטל פעולה זו.
      </template>
    </ConfirmDialog>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import NavigationButtons from './NavigationButtons.vue'
import InputArea from './InputArea.vue'
import KeyboardDisplay from './KeyboardDisplay.vue'
import StatsBar from './StatsBar.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { useTyping, getZoneName } from './UseTyping'
import { useUserProfile } from '../composables/useUserProfile'

const emit = defineEmits<{ 'show-intro': []; 'new-user': [] }>()

const { userName } = useUserProfile()

const inputAreaRef = ref<InstanceType<typeof InputArea> | null>(null)
const freeInputRef = ref<HTMLTextAreaElement | null>(null)
const lessonContentEl = ref<HTMLElement | null>(null)

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
  sessionElapsedMs,
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
  // progression
  lessonProgression,
  stageProgression,
  lessonStageLabel,
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
  clearAllProgress,
  clearAllProgressAndSession,
  // current target (for recall display)
  currentTarget,
} = useTyping({ title: '', text: '' }, userName)

// expose currentTarget for recall panel
// (it's already returned from useTyping)

function onBlur() {}

// ── Reset button handler ────────────────────────────────────────────────────
const showResetConfirm = ref(false)

const handleResetLesson = () => {
  showResetConfirm.value = true
}

const confirmReset = () => {
  showResetConfirm.value = false
  clearAllProgressAndSession()
}

// ── Auto-focus on lesson/zone change ────────────────────────────────────────
const focusInput = () => {
  if (exerciseMode.value === 'free') {
    freeInputRef.value?.focus()
  } else {
    inputAreaRef.value?.focusInput()
  }
}

watch(
  () => currentLesson.value?.lesson_id,
  () => focusInput()
)

watch(
  () => currentZoneIndex.value,
  () => focusInput()
)

// ── Personalised compliments ────────────────────────────────────────────────
const complimentMessages = [
  'כל הכבוד',
  'עבודה מצוינת',
  'מדהים',
  'ממשיכים קדימה',
  'מושלם',
]

// Resolved once per lesson completion, not on every reactive read
const summaryTitle = ref('✓ שיעור הושלם')

watch(showSummary, (visible) => {
  if (!visible) return
  const base = complimentMessages[Math.floor(Math.random() * complimentMessages.length)]
  summaryTitle.value = userName.value ? `${base}, ${userName.value}! ✓` : '✓ שיעור הושלם'
})
</script>

<style scoped>
/* ── Shell ── */
.typing-card {
  background: var(--bg-primary);
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
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 240ms ease;
}

.lesson-info:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
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
  letter-spacing: -0.02em;
}

.lesson-text {
  font-size: clamp(12px, 1.8vw, 15px);
  color: var(--text-secondary);
  white-space: pre-wrap;
  line-height: 1.55;
}

.guidance-hint {
  font-size: clamp(10px, 1.5vw, 13px);
  color: var(--text-secondary);
  background: rgba(0,120,212,0.08);
  padding: clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px);
  border-radius: 6px;
  border-right: 2px solid var(--accent-primary);
  line-height: 1.5;
  flex-shrink: 0;
  transition: background 200ms ease;
}

.guidance-hint:hover {
  background: rgba(0,120,212,0.12);
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
  border-radius: 6px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(9px, 1.4vw, 12px);
  font-weight: 600;
  color: var(--text-tertiary);
  transition: all 200ms ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.zone-pip:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.zone-pip--active {
  background: rgba(0,120,212,0.12);
  border-color: rgba(0,120,212,0.3);
  color: var(--accent-primary);
  font-weight: 700;
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
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  animation: slideUp 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
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
  transition: all 150ms ease;
}

.recall-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,120,212,0.2);
}

.recall-btn:active {
  transform: translateY(0);
}

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
  padding: 14px;
  font-size: 18px;
  line-height: 1.5;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  direction: rtl;
  transition: all 180ms ease;
  box-shadow: var(--shadow-sm);
}

.free-input:focus {
  border-color: rgba(0,120,212,0.35);
  box-shadow: inset 0 0 0 1px rgba(0,120,212,0.16), 0 2px 8px rgba(0,120,212,0.08);
}

.free-input::placeholder { color: var(--text-tertiary); }

/* ── Session expired overlay ── */
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

/* ── Lesson summary overlay ── */
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

.summary-btn:active {
  transform: translateY(0);
}

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
  border-radius: 12px;
  padding: clamp(14px, 2vw, 20px) clamp(18px, 3vw, 26px);
  font-size: clamp(13px, 2vw, 16px);
  font-weight: 700;
  text-align: center;
  box-shadow:
    0 1px 2px rgba(0,0,0,0.06),
    0 4px 12px rgba(0,0,0,0.08),
    0 16px 40px rgba(0,0,0,0.07);
  z-index: 300;
  animation: popIn 280ms cubic-bezier(0.34,1.56,0.64,1);
  max-width: 88%;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
