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

import { ref, computed, onMounted } from 'vue'

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

  const nextKey = computed(() => {
    const target = getTarget(currentLesson.value)
    return typed.value.length < target.length
      ? target[typed.value.length]
      : ''
  })

  const isComplete = computed(() => {
    const target = getTarget(currentLesson.value)
    return target.length > 0 && typed.value.length >= target.length
  })

  const displayText = computed(() => {
    if (!currentLesson.value) {
      return ''
    }

    const target = getTarget(currentLesson.value)
    let html = ''

    for (let i = 0; i < target.length; i++) {
      const c = target[i]

      if (i < typed.value.length) {
        if (typed.value[i] === c) {
          html += `<span class="correct">${c}</span>`
        } else {
          html += `<span class="wrong">${c}</span>`
        }
      } else if (i === typed.value.length) {
        html += `<span class="current">${c}</span>`
      } else {
        html += c
      }
    }

    return html
  })

  const resetTyping = () => {
    typed.value = ''
    accuracy.value = 100
    wpm.value = 0
    progress.value = 0
    start.value = null
    lastKey.value = ''
    heldKey.value = ''
    mistakeKey.value = ''
  }

  const clearAllProgress = () => {
    resetTyping()
    lessonProgress.value = {}
    weak.value = {}
    localStorage.removeItem('lessonProgress')
    localStorage.removeItem('weak')
  }

  const saveLessonProgress = () => {
    const lessonId = currentLesson.value.title
    lessonProgress.value[lessonId] = typed.value
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress.value))
  }

  const restartLesson = () => {
    resetTyping()
    saveLessonProgress()
  }

  const restoreLessonProgress = (lesson: Lesson) => {
    const lessonId = lesson.title
    const saved = lessonProgress.value[lessonId]
    typed.value = saved ?? ''
    if (typed.value.length > 0) {
      start.value = new Date()
    }
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

  const selectLesson = (lesson: Lesson) => {
    currentLesson.value = lesson
    restoreLessonProgress(lesson)
    accuracy.value = 100
    wpm.value = 0
    progress.value = Math.min(
      100,
      Math.round((typed.value.length / lesson.text.length) * 100)
    )
    lastKey.value = typed.value.slice(-1)
    if (typed.value.length > 0 && !start.value) {
      start.value = new Date()
    }
  }

  const onInput = () => {
    if (!start.value) {
      start.value = new Date()
    }

    const target = getTarget(currentLesson.value)
    let correct = 0

    for (let i = 0; i < typed.value.length; i++) {
      if (typed.value[i] === target[i]) {
        correct++
      } else {
        const expected = target[i]

        if (!weak.value[expected]) {
          weak.value[expected] = 0
        }

        weak.value[expected]++
      }
    }

    accuracy.value =
      typed.value.length === 0
        ? 100
        : Math.round((correct / typed.value.length) * 100)

    const elapsed = (new Date().getTime() - start.value.getTime()) / 1000 / 60

    wpm.value = elapsed > 0 ? Math.round((typed.value.length / 5) / elapsed) : 0

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

    if (weakLetters.length === 0) {
      return
    }

    const lesson: Lesson = {
      title: 'תרגיל חיזוק',
      text: (weakLetters.join(' ') + ' ').repeat(100)
    }

    currentLesson.value = lesson
    resetTyping()
  }

  onMounted(async () => {
    // Load stage data
    const stageNumbers = [1, 2, 3, 4, 5, 6]
    try {
      for (const num of stageNumbers) {
        const response = await fetch(`/stage_${num}.json`)
        if (response.ok) {
          const stage: Stage = await response.json()
          allStages.value.push(stage)
          if (currentLesson.value && currentLesson.value.title && !currentStage.value) {
            // Try to find if current lesson matches this stage
            const lesson = stage.lessons.find((l) => l.title === currentLesson.value.title)
            if (lesson) {
              currentStage.value = stage
            }
          }
        }
      }
      // If no current lesson is set, use first lesson from first stage
      if (allStages.value.length > 0 && (!currentLesson.value || !currentLesson.value.title)) {
        currentStage.value = allStages.value[0]
        currentLesson.value = allStages.value[0].lessons[0]
      }
    } catch (error) {
      console.error('Failed to load stages:', error)
    }

    const savedWeak = localStorage.getItem('weak')
    if (savedWeak) {
      weak.value = JSON.parse(savedWeak)
    }
    const savedProgress = localStorage.getItem('lessonProgress')
    if (savedProgress) {
      lessonProgress.value = JSON.parse(savedProgress)
    }
    restoreLessonProgress(currentLesson.value)
  })

  return {
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
