export interface Lesson {
  lesson_id?: string
  title: string
  text: string
  exercise?: string
}

export interface Stage {
  stage_id: string
  stage_title: string
  description: string
  lessons: Lesson[]
}

import { ref, computed, watch, onMounted } from 'vue'

function getTarget(lesson: Lesson) {
  return lesson.exercise ?? lesson.text
}

export function useTyping(initialLesson: Lesson) {
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

  // ── Navigation indices ──────────────────────────────────────────────────────

  const currentStageIndex = computed(() =>
    allStages.value.findIndex((s) => s.stage_id === currentStage.value?.stage_id)
  )

  const currentLessonIndex = computed(() => {
    if (!currentStage.value) return -1
    return currentStage.value.lessons.findIndex(
      (l) => l.title === currentLesson.value.title
    )
  })

  // ── Navigation capability flags ─────────────────────────────────────────────

  const canGoPrev = computed(
    () => currentLessonIndex.value > 0
  )

  const canGoNext = computed(
    () =>
      currentStage.value != null &&
      currentLessonIndex.value < currentStage.value.lessons.length - 1
  )

  const canGoPrevStage = computed(() => currentStageIndex.value > 0)

  const canGoNextStage = computed(
    () => currentStageIndex.value < allStages.value.length - 1
  )

  // Highlight the next-stage button when the last lesson of the stage is complete
  const highlightNextStage = computed(
    () =>
      isComplete.value &&
      !canGoNext.value &&
      canGoNextStage.value
  )

  // ── Core typing state ───────────────────────────────────────────────────────

  const nextKey = computed(() => {
    const target = getTarget(currentLesson.value)
    return typed.value.length < target.length ? target[typed.value.length] : ''
  })

  const isComplete = computed(() => {
    const target = getTarget(currentLesson.value)
    return target.length > 0 && typed.value.length >= target.length
  })

  const displayText = computed(() => {
    if (!currentLesson.value) return ''
    const target = getTarget(currentLesson.value)
    let html = ''
    for (let i = 0; i < target.length; i++) {
      const c = target[i]
      if (i < typed.value.length) {
        html +=
          typed.value[i] === c
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

  // ── Auto-advance on completion ──────────────────────────────────────────────

  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

  watch(isComplete, (done) => {
    if (!done) return
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = setTimeout(() => {
      if (canGoNext.value) {
        goNextLesson()
      } else if (canGoNextStage.value) {
        goNextStage()
      }
    }, 800) // short pause so the user sees the completed state
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
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      autoAdvanceTimer = null
    }
  }

  const saveLessonProgress = () => {
    const lessonId = currentLesson.value.title
    lessonProgress.value[lessonId] = typed.value
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress.value))
  }

  const restoreLessonProgress = (lesson: Lesson) => {
    const saved = lessonProgress.value[lesson.title]
    typed.value = saved ?? ''
    if (typed.value.length > 0) start.value = new Date()
  }

  const applyLesson = (lesson: Lesson) => {
    currentLesson.value = lesson
    restoreLessonProgress(lesson)
    accuracy.value = 100
    wpm.value = 0
    progress.value = Math.min(
      100,
      Math.round((typed.value.length / getTarget(lesson).length) * 100)
    )
    lastKey.value = typed.value.slice(-1)
    if (typed.value.length > 0 && !start.value) start.value = new Date()
  }

  // ── Navigation actions ──────────────────────────────────────────────────────

  const goPrevLesson = () => {
    if (!canGoPrev.value || !currentStage.value) return
    resetTyping()
    applyLesson(currentStage.value.lessons[currentLessonIndex.value - 1])
  }

  const goNextLesson = () => {
    if (!canGoNext.value || !currentStage.value) return
    resetTyping()
    applyLesson(currentStage.value.lessons[currentLessonIndex.value + 1])
  }

  const goPrevStage = () => {
    if (!canGoPrevStage.value) return
    const stage = allStages.value[currentStageIndex.value - 1]
    currentStage.value = stage
    resetTyping()
    applyLesson(stage.lessons[0])
  }

  const goNextStage = () => {
    if (!canGoNextStage.value) return
    const stage = allStages.value[currentStageIndex.value + 1]
    currentStage.value = stage
    resetTyping()
    applyLesson(stage.lessons[0])
  }

  // ── Public API (kept for backwards compat) ──────────────────────────────────

  const clearAllProgress = () => {
    resetTyping()
    lessonProgress.value = {}
    weak.value = {}
    localStorage.removeItem('lessonProgress')
    localStorage.removeItem('weak')
  }

  const restartLesson = () => {
    clearAllProgress()
    if (allStages.value.length > 0) {
      currentStage.value = allStages.value[0]
      currentLesson.value = allStages.value[0].lessons[0]
    }
  }

  /** Legacy: select an arbitrary lesson within the current stage */
  const selectLesson = (lesson: Lesson) => {
    resetTyping()
    applyLesson(lesson)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    heldKey.value = event.key
  }

  const triggerEnglishWarning = () => {
    englishWarning.value = true
    window.clearTimeout((triggerEnglishWarning as any).timer)
    ;(triggerEnglishWarning as any).timer = window.setTimeout(() => {
      englishWarning.value = false
    }, 1400)
  }

  const triggerMistake = (key: string) => {
    mistakeKey.value = key
    window.clearTimeout((triggerMistake as any).timer)
    ;(triggerMistake as any).timer = window.setTimeout(() => {
      mistakeKey.value = ''
    }, 360)
  }

  const onKeyUp = () => {
    heldKey.value = ''
  }

  const clearHeldKey = () => {
    heldKey.value = ''
  }

  const onInput = () => {
    if (!start.value) start.value = new Date()

    const target = getTarget(currentLesson.value)
    let correct = 0

    for (let i = 0; i < typed.value.length; i++) {
      if (typed.value[i] === target[i]) {
        correct++
      } else {
        const expected = target[i]
        weak.value[expected] = (weak.value[expected] ?? 0) + 1
      }
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
      text: (weakLetters.join(' ') + ' ').repeat(100)
    }

    currentLesson.value = lesson
    resetTyping()
  }

  // ── Bootstrap ───────────────────────────────────────────────────────────────

  onMounted(async () => {
    const stageNumbers = [1, 2, 3, 4, 5, 6]
    try {
      for (const num of stageNumbers) {
        const response = await fetch(`/stage_${num}.json`)
        if (response.ok) {
          const stage: Stage = await response.json()
          allStages.value.push(stage)
          if (currentLesson.value?.title && !currentStage.value) {
            const match = stage.lessons.find(
              (l) => l.title === currentLesson.value.title
            )
            if (match) currentStage.value = stage
          }
        }
      }

      if (allStages.value.length > 0 && !currentLesson.value?.title) {
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

    restoreLessonProgress(currentLesson.value)
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
    currentLesson,
    currentStage,
    allStages,
    displayText,
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
    onInput,
    onKeyDown,
    onKeyUp,
    clearHeldKey,
    triggerMistake,
    triggerEnglishWarning,
    selectLesson,
    restartLesson,
    clearAllProgress,
    generateWeakLesson
  }
}