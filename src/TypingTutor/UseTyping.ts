export type { ExerciseZones, Lesson, Stage, ExerciseMode, ZoneKey } from './TypingTypes'
export { getZoneName } from './useZoneProgress'

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Lesson, Stage, ExerciseMode } from './TypingTypes'
import { stages as bundledStages } from 'virtual:stages'
import { fireConfetti } from '../composables/useConfetti'
import { AYIN } from '../KeyboardDisplay/HebrewKeyboard'
import { useSessionTimer } from './useSessionTimer'
import { useZoneProgress } from './useZoneProgress'
import { useLessonNavigation } from './useLessonNavigation'
import { useTypingInput } from './useTypingInput'

export function useTyping(initialLesson: Lesson, userName?: Ref<string>) {
  // ── Per-user key helpers ────────────────────────────────────────────────────
  function userPrefix(): string {
    const name = userName?.value?.trim()
    return name ? `user:${name}:` : ''
  }
  function userKey(key: string): string { return `${userPrefix()}${key}` }

  // ── Core state ──────────────────────────────────────────────────────────────
  const typed = ref('')
  const accuracy = ref(100)
  const wpm = ref(0)
  const progress = ref(0)
  const start = ref<Date | null>(null)
  const lastKey = ref('')
  const heldKey = ref('')
  const mistakeKey = ref('')
  const lessonProgress = ref<Record<string, string>>({})
  const weak = ref<Record<string, number>>({})
  const currentLesson = ref<Lesson>(initialLesson)
  const currentStage = ref<Stage | null>(null)
  const allStages = ref<Stage[]>([])

  const exerciseMode = computed<ExerciseMode>(
    () => (currentLesson.value.exercise_mode as ExerciseMode) ?? 'copy'
  )

  // ── Sub-composables ─────────────────────────────────────────────────────────
  const session = useSessionTimer(userKey)

  const ayinCorrect = ref(0)
  const ayinTotal = ref(0)
  const ayinAccuracy = computed(() =>
    ayinTotal.value === 0 ? null : Math.round((ayinCorrect.value / ayinTotal.value) * 100)
  )

  const showSummary = ref(false)
  const summaryData = ref<{
    accuracy: number; wpm: number; ayinAccuracy: number | null
    timeUsedMs: number; hasAyinCheck: boolean
  } | null>(null)

  function triggerLessonComplete() {
    fireConfetti()
    summaryData.value = {
      accuracy: accuracy.value, wpm: wpm.value,
      ayinAccuracy: currentLesson.value.ayin_check ? ayinAccuracy.value : null,
      timeUsedMs: session.sessionElapsedMs.value,
      hasAyinCheck: currentLesson.value.ayin_check ?? false,
    }
    showSummary.value = true
  }

  const zone = useZoneProgress(
    currentLesson, exerciseMode, typed,
    () => resetZone(),
    () => triggerLessonComplete(),
  )

  // ── Display ─────────────────────────────────────────────────────────────────
  const displayText = computed(() => {
    if (exerciseMode.value === 'free') return ''
    if (exerciseMode.value === 'recall' && zone.recallHidden.value) return ''
    const target = zone.currentTarget.value
    let html = ''
    for (let i = 0; i < target.length; i++) {
      const c = target[i] === ' ' ? '\u00a0' : target[i]
      if (i < typed.value.length) {
        html += typed.value[i] === target[i]
          ? `<span class="correct">${c}</span>`
          : `<span class="wrong">${c}</span>`
      } else if (i === typed.value.length) {
        html += `<span class="current">${c}</span>`
      } else {
        html += c
      }
    }
    return html
  })

  const nextKey = computed(() => {
    if (exerciseMode.value === 'free') return ''
    const t = zone.currentTarget.value
    return typed.value.length < t.length ? t[typed.value.length] : ''
  })

  // ── Reset helpers ───────────────────────────────────────────────────────────
  function resetTyping() {
    typed.value = ''
    accuracy.value = 100; wpm.value = 0; progress.value = 0; start.value = null
    lastKey.value = ''; heldKey.value = ''; mistakeKey.value = ''
    ayinCorrect.value = 0; ayinTotal.value = 0
    showSummary.value = false; summaryData.value = null
    zone.resetZoneState(); zone.clearAutoAdvance()
  }

  function resetZone() {
    typed.value = ''
    accuracy.value = 100; wpm.value = 0; progress.value = 0; start.value = null
    lastKey.value = ''; mistakeKey.value = ''
    zone.resetZoneState(); zone.clearAutoAdvance()
  }

  // ── Lesson application ──────────────────────────────────────────────────────
  function applyLesson(lesson: Lesson) {
    currentLesson.value = lesson
    zone.currentZoneIndex.value = 0
    resetTyping()
    const lessonId = lesson.lesson_id ?? lesson.title
    const saved = lessonProgress.value[lessonId]
    if (saved) {
      typed.value = saved
      if (typed.value.length > 0) start.value = new Date()
    }
    accuracy.value = 100; wpm.value = 0
    progress.value = Math.min(
      100,
      zone.currentTarget.value.length > 0
        ? Math.round((typed.value.length / zone.currentTarget.value.length) * 100)
        : 0
    )
    lastKey.value = typed.value.slice(-1)
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  const nav = useLessonNavigation(
    allStages, currentStage, currentLesson,
    applyLesson, session.stopSessionTimer,
  )

  const highlightNextStage = computed(
    () => zone.isComplete.value && !nav.canGoNext.value && nav.canGoNextStage.value
  )

  function dismissSummaryAndAdvance() {
    showSummary.value = false; summaryData.value = null
    if (nav.canGoNext.value) nav.goNextLesson()
    else if (nav.canGoNextStage.value) nav.goNextStage()
  }

  function dismissSummaryAndStay() {
    showSummary.value = false; summaryData.value = null
    zone.currentZoneIndex.value = 0
    resetTyping()
  }

  function restartLesson() {
    session.stopSessionTimer()
    zone.currentZoneIndex.value = 0
    resetTyping()
  }

  function selectLesson(lesson: Lesson) {
    session.stopSessionTimer()
    applyLesson(lesson)
  }

  // ── Input handling ──────────────────────────────────────────────────────────
  function saveLessonProgress() {
    const lessonId = currentLesson.value.lesson_id ?? currentLesson.value.title
    lessonProgress.value[lessonId] = typed.value
    localStorage.setItem(userKey('lessonProgress'), JSON.stringify(lessonProgress.value))
  }

  const input = useTypingInput(
    typed, accuracy, wpm, progress, start, lastKey, heldKey, mistakeKey,
    weak, ayinCorrect, ayinTotal, currentLesson, exerciseMode,
    zone.currentTarget, session.sessionExpired,
    session.startSessionTimer,
    saveLessonProgress,
    () => localStorage.setItem(userKey('weak'), JSON.stringify(weak.value)),
  )

  // ── Progress persistence ────────────────────────────────────────────────────
  function clearAllProgress() {
    resetTyping()
    lessonProgress.value = {}; weak.value = {}
    localStorage.removeItem(userKey('lessonProgress'))
    localStorage.removeItem(userKey('weak'))
  }

  function clearAllProgressAndSession() {
    clearAllProgress()
    session.resetSession()
  }

  // ── Weak-letter drill ───────────────────────────────────────────────────────
  function generateWeakLesson() {
    const weakLetters = Object.entries(weak.value)
      .sort((a, b) => b[1] - a[1]).slice(0, 5).map((x) => x[0])
    if (weakLetters.length === 0) return
    const lesson: Lesson = {
      title: 'תרגיל חיזוק',
      text: 'תרגיל מותאם אישית — האותיות שגרמו לך לטעויות הכי הרבה.',
      exercise_zones: { zone_a: null, zone_b: null, zone_c: (weakLetters.join(' ') + ' ').repeat(20).trim() },
      exercise_mode: 'copy',
      ayin_check: weakLetters.includes(AYIN),
    }
    currentLesson.value = lesson
    zone.currentZoneIndex.value = 0
    resetTyping()
  }

  // ── Bootstrap ───────────────────────────────────────────────────────────────
  onMounted(async () => {
    try {
      const results: (Stage | null)[] = await Promise.resolve(bundledStages)
      for (const stage of results) { if (stage) allStages.value.push(stage as Stage) }
      if (allStages.value.length > 0) {
        currentStage.value = allStages.value[0]
        currentLesson.value = allStages.value[0].lessons[0]
      }
    } catch (error) { console.error('Failed to load stages:', error) }
    const savedWeak = localStorage.getItem(userKey('weak'))
    if (savedWeak) weak.value = JSON.parse(savedWeak)
    const savedProgress = localStorage.getItem(userKey('lessonProgress'))
    if (savedProgress) lessonProgress.value = JSON.parse(savedProgress)
  })

  watch(
    () => ({ stage: nav.currentStageIndex.value, lesson: nav.currentLessonIndex.value }),
    () => {
      if (nav.stageProgression.value && nav.lessonProgression.value)
        document.title = `הקלדה עיברית — ${nav.lessonStageLabel.value}`
    },
    { immediate: true }
  )

  if (userName) {
    watch(userName, () => {
      const savedWeak = localStorage.getItem(userKey('weak'))
      weak.value = savedWeak ? JSON.parse(savedWeak) : {}
      const savedProgress = localStorage.getItem(userKey('lessonProgress'))
      lessonProgress.value = savedProgress ? JSON.parse(savedProgress) : {}
      session.reloadSessionForUser()
      zone.currentZoneIndex.value = 0
      resetTyping()
    })
  }

  onUnmounted(() => {
    // session timer, zone auto-advance, and input timers clean themselves up
  })

  return {
    typed, accuracy, wpm, progress, lastKey, heldKey, nextKey, mistakeKey,
    englishWarning: input.englishWarning,
    isComplete: zone.isComplete, isZoneDone: zone.isZoneDone,
    currentLesson, currentStage, allStages, displayText, exerciseMode,
    currentZone: zone.currentZone, currentZoneIndex: zone.currentZoneIndex,
    availableZones: zone.availableZones, isLastZone: zone.isLastZone,
    advanceZone: zone.advanceZone,
    recallReady: zone.recallReady, recallHidden: zone.recallHidden,
    startRecall: zone.startRecall,
    sessionElapsedMs: session.sessionElapsedMs,
    sessionWarning: session.sessionWarning, sessionExpired: session.sessionExpired,
    sessionSecondsDisplay: session.sessionSecondsDisplay,
    sessionMinutesLeft: session.sessionMinutesLeft,
    ayinAccuracy, ayinTotal,
    showSummary, summaryData, dismissSummaryAndAdvance, dismissSummaryAndStay,
    canGoPrev: nav.canGoPrev, canGoNext: nav.canGoNext,
    canGoPrevStage: nav.canGoPrevStage, canGoNextStage: nav.canGoNextStage,
    highlightNextStage,
    lessonProgression: nav.lessonProgression, stageProgression: nav.stageProgression,
    lessonStageLabel: nav.lessonStageLabel,
    goPrevLesson: nav.goPrevLesson, goNextLesson: nav.goNextLesson,
    goPrevStage: nav.goPrevStage, goNextStage: nav.goNextStage,
    onInput: input.onInput, onKeyDown: input.onKeyDown, onKeyUp: input.onKeyUp,
    clearHeldKey: input.clearHeldKey,
    triggerMistake: input.triggerMistake,
    triggerEnglishWarning: input.triggerEnglishWarning,
    selectLesson, restartLesson,
    dismissExpired: session.dismissExpired,
    continueAfterExpiration: session.continueAfterExpiration,
    clearAllProgress, clearAllProgressAndSession, generateWeakLesson,
    currentTarget: zone.currentTarget,
  }
}
