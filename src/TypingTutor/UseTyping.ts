export interface ExerciseZones {
  zone_a: string | null
  zone_b: string | null
  zone_c: string | null
}

export interface Lesson {
  lesson_id?: string
  title: string
  text: string
  exercise?: string
  phase_label?: string
  salthouse_target?: string
  exercise_mode?: string
  session_guidance?: string
  exercise_zones?: ExerciseZones
  ayin_check?: boolean
}

export interface Stage {
  stage_id: string
  stage_title: string
  description: string
  phase_context?: string
  high_frequency_anchor_words?: string[]
  lessons: Lesson[]
}

export type ExerciseMode = 'copy' | 'recall' | 'free'
export type ZoneKey = 'zone_a' | 'zone_b' | 'zone_c'

// ── Zone helpers ─────────────────────────────────────────────────────────────

export function getZones(lesson: Lesson): ZoneKey[] {
  if (!lesson.exercise_zones) return ['zone_c']
  const keys: ZoneKey[] = ['zone_a', 'zone_b', 'zone_c']
  return keys.filter((k) => lesson.exercise_zones![k] !== null)
}

export function getZoneText(lesson: Lesson, zone: ZoneKey): string {
  return lesson.exercise_zones?.[zone] ?? ''
}

export function getZoneLabel(zone: ZoneKey): string {
  return { zone_a: 'א', zone_b: 'ב', zone_c: 'ג' }[zone]
}

export function getZoneName(zone: ZoneKey): string {
  return { zone_a: 'הכרה', zone_b: 'מילים', zone_c: 'ערבוב' }[zone]
}

// Hebrew letter check
const HEBREW_RE = /[\u05d0-\u05ea]/
const AYIN = 'ע'

export function countAyin(text: string): number {
  return [...text].filter((c) => c === AYIN).length
}

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { stages as bundledStages } from 'virtual:stages'
import { fireConfetti } from '../composables/useConfetti'

export function useTyping(initialLesson: Lesson) {
  // ── Core state ──────────────────────────────────────────────────────────────
  const typed = ref('')
  const accuracy = ref(100)
  const wpm = ref(0)
  const progress = ref(0)
  const start = ref<Date | null>(null)
  const lastKey = ref('')
  const heldKey = ref('')
  const mistakeKey = ref('')
  const englishWarning = ref(false)
  const lessonProgress = ref<Record<string, string>>({})
  const weak = ref<Record<string, number>>({})
  const currentLesson = ref<Lesson>(initialLesson)
  const currentStage = ref<Stage | null>(null)
  const allStages = ref<Stage[]>([])

  // ── Zone state ──────────────────────────────────────────────────────────────
  const currentZoneIndex = ref(0)
  const zoneComplete = ref(false)

  const availableZones = computed(() => getZones(currentLesson.value))

  const currentZone = computed<ZoneKey>(
    () => availableZones.value[currentZoneIndex.value] ?? 'zone_c'
  )

  const isLastZone = computed(
    () => currentZoneIndex.value >= availableZones.value.length - 1
  )

  // ── Exercise mode ───────────────────────────────────────────────────────────
  const exerciseMode = computed<ExerciseMode>(
    () => (currentLesson.value.exercise_mode as ExerciseMode) ?? 'copy'
  )

  // recall mode: text is hidden after the user clicks "ready"
  const recallReady = ref(false)   // user has read the text and clicked ready
  const recallHidden = ref(false)  // text is now hidden, typing begins

  // ── Session timer (Baddeley & Longman 1978: 20 min max per day) ─────────────
  const SESSION_MAX_MS = 20 * 60 * 1000

  function todayKey(): string {
    const d = new Date()
    return `sessionTime_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function loadTodayMs(): number {
    return parseInt(localStorage.getItem(todayKey()) ?? '0', 10) || 0
  }

  function saveTodayMs(ms: number) {
    localStorage.setItem(todayKey(), String(ms))
  }

  const sessionElapsedMs = ref(loadTodayMs())
  const sessionWarning = ref(sessionElapsedMs.value >= 18 * 60 * 1000)
  const sessionExpired = ref(sessionElapsedMs.value >= SESSION_MAX_MS)
  let sessionTimerInterval: ReturnType<typeof setInterval> | null = null

  function startSessionTimer() {
    // Don't start if already expired for today
    if (sessionExpired.value) return
    if (sessionTimerInterval) return
    sessionTimerInterval = setInterval(() => {
      sessionElapsedMs.value += 1000
      saveTodayMs(sessionElapsedMs.value)
      if (sessionElapsedMs.value >= SESSION_MAX_MS) {
        sessionExpired.value = true
        sessionWarning.value = false
        stopSessionTimer()
      } else if (sessionElapsedMs.value >= 18 * 60 * 1000) {
        sessionWarning.value = true
      }
    }, 1000)
  }

  function stopSessionTimer() {
    if (sessionTimerInterval) {
      clearInterval(sessionTimerInterval)
      sessionTimerInterval = null
    }
  }

  const sessionMinutesLeft = computed(() => {
    const remaining = SESSION_MAX_MS - sessionElapsedMs.value
    return Math.max(0, Math.ceil(remaining / 60000))
  })

  const sessionSecondsDisplay = computed(() => {
    const remaining = Math.max(0, SESSION_MAX_MS - sessionElapsedMs.value)
    const m = Math.floor(remaining / 60000)
    const s = Math.floor((remaining % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  })

  // ── ע (ayin) tracking ───────────────────────────────────────────────────────
  const ayinCorrect = ref(0)
  const ayinTotal = ref(0)

  const ayinAccuracy = computed(() =>
    ayinTotal.value === 0 ? null : Math.round((ayinCorrect.value / ayinTotal.value) * 100)
  )

  // ── Lesson completion summary ───────────────────────────────────────────────
  const showSummary = ref(false)
  const summaryData = ref<{
    accuracy: number
    wpm: number
    ayinAccuracy: number | null
    timeUsedMs: number
    hasAyinCheck: boolean
  } | null>(null)

  // ── Navigation indices ──────────────────────────────────────────────────────
  const currentStageIndex = computed(() =>
    allStages.value.findIndex((s) => s.stage_id === currentStage.value?.stage_id)
  )

  const currentLessonIndex = computed(() => {
    if (!currentStage.value) return -1
    return currentStage.value.lessons.findIndex(
      (l) => l.lesson_id
        ? l.lesson_id === currentLesson.value.lesson_id
        : l.title === currentLesson.value.title
    )
  })

  const lessonProgression = computed(() => {
    if (!currentStage.value || currentLessonIndex.value < 0) return ''
    const current = currentLessonIndex.value + 1
    const total = currentStage.value.lessons.length
    return `${current}/${total}`
  })

  const stageProgression = computed(() => {
    if (currentStageIndex.value < 0) return ''
    const current = currentStageIndex.value + 1
    const total = allStages.value.length
    return `${current}/${total}`
  })

  // lesson number / stage number — e.g. "2/1"
  const lessonStageLabel = computed(() => {
    if (currentStageIndex.value < 0 || currentLessonIndex.value < 0) return ''
    return `${currentLessonIndex.value + 1}/${currentStageIndex.value + 1}`
  })

  const canGoPrev = computed(() => currentLessonIndex.value > 0)

  const canGoNext = computed(
    () =>
      currentStage.value != null &&
      currentLessonIndex.value < currentStage.value.lessons.length - 1
  )

  const canGoPrevStage = computed(() => currentStageIndex.value > 0)

  const canGoNextStage = computed(
    () => currentStageIndex.value < allStages.value.length - 1
  )

  // ── Core typing state ───────────────────────────────────────────────────────
  const currentTarget = computed(() => {
    const lesson = currentLesson.value
    if (exerciseMode.value === 'free') return ''
    const zone = currentZone.value
    const zoneText = getZoneText(lesson, zone)
    if (zoneText) return zoneText
    // fallback
    if (lesson.exercise_zones) {
      const zones = getZones(lesson)
      for (const z of zones) {
        const t = getZoneText(lesson, z)
        if (t) return t
      }
    }
    return lesson.exercise ?? lesson.text
  })

  const nextKey = computed(() => {
    if (exerciseMode.value === 'free') return ''
    const t = currentTarget.value
    return typed.value.length < t.length ? t[typed.value.length] : ''
  })

  const isZoneDone = computed(() => {
    if (exerciseMode.value === 'free') return false
    const t = currentTarget.value
    return t.length > 0 && typed.value.length >= t.length
  })

  const isComplete = computed(() => {
    if (exerciseMode.value === 'free') return false
    return isZoneDone.value && isLastZone.value
  })

  const highlightNextStage = computed(
    () => isComplete.value && !canGoNext.value && canGoNextStage.value
  )

  const displayText = computed(() => {
    if (exerciseMode.value === 'free') return ''
    if (exerciseMode.value === 'recall' && recallHidden.value) return ''
    const target = currentTarget.value
    let html = ''
    for (let i = 0; i < target.length; i++) {
      const c = target[i] === ' ' ? '\u00a0' : target[i]
      if (i < typed.value.length) {
        html +=
          typed.value[i] === target[i]
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

  // ── Auto-advance zone on completion ────────────────────────────────────────
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

  watch(isZoneDone, (done) => {
    if (!done) return
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = setTimeout(() => {
      if (!isLastZone.value) {
        // advance to next zone
        advanceZone()
      } else {
        // lesson complete — show summary
        triggerLessonComplete()
      }
    }, 600)
  })

  // ── Internal helpers ────────────────────────────────────────────────────────
  const resetTyping = () => {
    typed.value = ''
    accuracy.value = 100
    wpm.value = 0
    progress.value = 0
    start.value = null
    lastKey.value = ''
    heldKey.value = ''
    mistakeKey.value = ''
    ayinCorrect.value = 0
    ayinTotal.value = 0
    recallReady.value = false
    recallHidden.value = false
    showSummary.value = false
    summaryData.value = null
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      autoAdvanceTimer = null
    }
  }

  const resetZone = () => {
    typed.value = ''
    accuracy.value = 100
    wpm.value = 0
    progress.value = 0
    start.value = null
    lastKey.value = ''
    mistakeKey.value = ''
    recallReady.value = false
    recallHidden.value = false
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      autoAdvanceTimer = null
    }
  }

  const advanceZone = () => {
    if (isLastZone.value) return
    currentZoneIndex.value++
    resetZone()
  }

  const triggerLessonComplete = () => {
    fireConfetti()
    summaryData.value = {
      accuracy: accuracy.value,
      wpm: wpm.value,
      ayinAccuracy: currentLesson.value.ayin_check ? ayinAccuracy.value : null,
      timeUsedMs: sessionElapsedMs.value,
      hasAyinCheck: currentLesson.value.ayin_check ?? false,
    }
    showSummary.value = true
  }

  const saveLessonProgress = () => {
    const lessonId = currentLesson.value.lesson_id ?? currentLesson.value.title
    lessonProgress.value[lessonId] = typed.value
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress.value))
  }

  const applyLesson = (lesson: Lesson) => {
    currentLesson.value = lesson
    currentZoneIndex.value = 0
    resetTyping()
    // restore progress for zone_c only (the main zone)
    const lessonId = lesson.lesson_id ?? lesson.title
    const saved = lessonProgress.value[lessonId]
    if (saved) {
      typed.value = saved
      if (typed.value.length > 0) start.value = new Date()
    }
    accuracy.value = 100
    wpm.value = 0
    progress.value = Math.min(
      100,
      currentTarget.value.length > 0
        ? Math.round((typed.value.length / currentTarget.value.length) * 100)
        : 0
    )
    lastKey.value = typed.value.slice(-1)
  }

  // ── Navigation actions ──────────────────────────────────────────────────────
  const goPrevLesson = () => {
    if (!canGoPrev.value || !currentStage.value) return
    stopSessionTimer()
    applyLesson(currentStage.value.lessons[currentLessonIndex.value - 1])
  }

  const goNextLesson = () => {
    if (!canGoNext.value || !currentStage.value) return
    stopSessionTimer()
    applyLesson(currentStage.value.lessons[currentLessonIndex.value + 1])
  }

  const goPrevStage = () => {
    if (!canGoPrevStage.value) return
    const stage = allStages.value[currentStageIndex.value - 1]
    currentStage.value = stage
    stopSessionTimer()
    applyLesson(stage.lessons[0])
  }

  const goNextStage = () => {
    if (!canGoNextStage.value) return
    const stage = allStages.value[currentStageIndex.value + 1]
    currentStage.value = stage
    stopSessionTimer()
    applyLesson(stage.lessons[0])
  }

  const dismissSummaryAndAdvance = () => {
    showSummary.value = false
    summaryData.value = null
    if (canGoNext.value) {
      goNextLesson()
    } else if (canGoNextStage.value) {
      goNextStage()
    }
  }

  const dismissSummaryAndStay = () => {
    showSummary.value = false
    summaryData.value = null
    // reset to beginning of lesson
    currentZoneIndex.value = 0
    resetTyping()
  }

  // ── Public API ──────────────────────────────────────────────────────────────
  const clearAllProgress = () => {
    resetTyping()
    lessonProgress.value = {}
    weak.value = {}
    localStorage.removeItem('lessonProgress')
    localStorage.removeItem('weak')
  }

  const restartLesson = () => {
    stopSessionTimer()
    currentZoneIndex.value = 0
    resetTyping()
  }

  const selectLesson = (lesson: Lesson) => {
    stopSessionTimer()
    applyLesson(lesson)
  }

  // Dismiss the expired overlay — the day's time is spent, just hide the modal
  const dismissExpired = () => {
    sessionExpired.value = false
  }

  // Continue after expiration — reset the session timer for a new session
  const continueAfterExpiration = () => {
    sessionExpired.value = false
    sessionElapsedMs.value = 0
    saveTodayMs(0)
    sessionWarning.value = false
    // Reset typing state to allow fresh input
    typed.value = ''
    start.value = null
    accuracy.value = 100
    wpm.value = 0
    progress.value = 0
    // Restart the session timer for the new session
    startSessionTimer()
  }

  // recall mode: user signals they've read the text
  const startRecall = () => {
    recallReady.value = true
    recallHidden.value = true
    typed.value = ''
    start.value = null
  }

  const onKeyDown = (event: KeyboardEvent) => {
    heldKey.value = event.key
  }

  const triggerEnglishWarning = () => {
    englishWarning.value = true
    window.clearTimeout((triggerEnglishWarning as any)._timer)
    ;(triggerEnglishWarning as any)._timer = window.setTimeout(() => {
      englishWarning.value = false
    }, 1400)
  }

  const triggerMistake = (key: string) => {
    mistakeKey.value = key
    window.clearTimeout((triggerMistake as any)._timer)
    ;(triggerMistake as any)._timer = window.setTimeout(() => {
      mistakeKey.value = ''
    }, 360)
  }

  const onKeyUp = () => {
    heldKey.value = '' 
  }

  const clearHeldKey = () => {
    heldKey.value = ''
  }

  const onInput = (e?: Event) => {
    // Block input if today's session is expired
    if (sessionExpired.value) return

    // English keyboard detection
    if (e && exerciseMode.value !== 'free') {
      const textarea = e.target as HTMLTextAreaElement
      const lastChar = textarea.value.slice(-1)
      if (lastChar && /[a-zA-Z]/.test(lastChar)) {
        triggerEnglishWarning()
        // strip the latin character
        typed.value = textarea.value.slice(0, -1)
        textarea.value = typed.value
        return
      }
    }

    if (!start.value) {
      start.value = new Date()
      startSessionTimer()
    }

    if (exerciseMode.value === 'free') {
      lastKey.value = typed.value.slice(-1)
      saveLessonProgress()
      return
    }

    const target = currentTarget.value
    let correct = 0
    let ayinC = 0
    let ayinT = 0

    for (let i = 0; i < typed.value.length; i++) {
      const expected = target[i]
      const actual = typed.value[i]
      if (actual === expected) {
        correct++
        if (expected === AYIN) ayinC++
      } else {
        weak.value[expected] = (weak.value[expected] ?? 0) + 1
      }
      if (expected === AYIN) ayinT++
    }

    if (currentLesson.value.ayin_check) {
      ayinCorrect.value = ayinC
      ayinTotal.value = ayinT
    }

    accuracy.value =
      typed.value.length === 0
        ? 100
        : Math.round((correct / typed.value.length) * 100)

    const elapsed = (new Date().getTime() - start.value!.getTime()) / 1000 / 60
    wpm.value = elapsed > 0 ? Math.round(typed.value.length / 5 / elapsed) : 0

    progress.value = Math.min(
      100,
      Math.round((typed.value.length / target.length) * 100)
    )

    lastKey.value = typed.value.slice(-1)

    saveLessonProgress()
    localStorage.setItem('weak', JSON.stringify(weak.value))
  }

  const generateWeakLesson = () => {
    const weakLetters = Object.entries(weak.value)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((x) => x[0])

    if (weakLetters.length === 0) return

    const lesson: Lesson = {
      title: 'תרגיל חיזוק',
      text: 'תרגיל מותאם אישית — האותיות שגרמו לך לטעויות הכי הרבה.',
      exercise_zones: {
        zone_a: null,
        zone_b: null,
        zone_c: (weakLetters.join(' ') + ' ').repeat(20).trim()
      },
      exercise_mode: 'copy',
      ayin_check: weakLetters.includes(AYIN)
    }

    currentLesson.value = lesson
    currentZoneIndex.value = 0
    resetTyping()
  }

  // ── Bootstrap ───────────────────────────────────────────────────────────────
  onMounted(async () => {
    try {
      // bundledStages is a plain array at build time (inlined JSON),
      // or a Promise in dev (fetched from the dev server)
      const results: (Stage | null)[] = await Promise.resolve(bundledStages)
      for (const stage of results) {
        if (stage) allStages.value.push(stage as Stage)
      }

      if (allStages.value.length > 0) {
        currentStage.value = allStages.value[0]
        currentLesson.value = allStages.value[0].lessons[0]
      }
    } catch (error) {
      console.error('Failed to load stages:', error)
    }

    const savedWeak = localStorage.getItem('weak')
    if (savedWeak) weak.value = JSON.parse(savedWeak)

    const savedProgress = localStorage.getItem('lessonProgress')
    if (savedProgress) lessonProgress.value = JSON.parse(savedProgress)
  })

  // ── Update document title with progression ──────────────────────────────────
  watch(
    () => ({ stage: currentStageIndex.value, lesson: currentLessonIndex.value }),
    () => {
      const stageProg = stageProgression.value
      const lessonProg = lessonProgression.value
      if (stageProg && lessonProg) {
        document.title = `הקלדה עיברית — ${lessonStageLabel.value}`
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    stopSessionTimer()
  })

  return {
    // state
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
    isZoneDone,
    currentLesson,
    currentStage,
    allStages,
    displayText,
    exerciseMode,
    // zone state
    currentZone,
    currentZoneIndex,
    availableZones,
    isLastZone,
    advanceZone,
    // recall mode
    recallReady,
    recallHidden,
    startRecall,
    // session timer
    sessionElapsedMs,
    sessionWarning,
    sessionExpired,
    sessionSecondsDisplay,
    sessionMinutesLeft,
    // ayin tracking
    ayinAccuracy,
    ayinTotal,
    // lesson summary
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
    onInput,
    onKeyDown,
    onKeyUp,
    clearHeldKey,
    triggerMistake,
    triggerEnglishWarning,
    selectLesson,
    restartLesson,
    dismissExpired,
    continueAfterExpiration,
    clearAllProgress,
    generateWeakLesson,
  }
}
