import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Lesson, Stage } from './TypingTypes'

export function useLessonNavigation(
  allStages: Ref<Stage[]>,
  currentStage: Ref<Stage | null>,
  currentLesson: Ref<Lesson>,
  applyLesson: (lesson: Lesson) => void,
  stopSessionTimer: () => void,
  navigateToLesson?: (lesson: Lesson, stage?: Stage) => void,
) {
  const currentStageIndex = computed(() =>
    allStages.value.findIndex((s) => s.stage_id === currentStage.value?.stage_id)
  )

  const currentLessonIndex = computed(() => {
    if (!currentStage.value) return -1
    return currentStage.value.lessons.findIndex((l) =>
      l.lesson_id
        ? l.lesson_id === currentLesson.value.lesson_id
        : l.title === currentLesson.value.title
    )
  })

  const lessonProgression = computed(() => {
    if (!currentStage.value || currentLessonIndex.value < 0) return ''
    return `${currentLessonIndex.value + 1}/${currentStage.value.lessons.length}`
  })

  const stageProgression = computed(() => {
    if (currentStageIndex.value < 0) return ''
    return `${currentStageIndex.value + 1}/${allStages.value.length}`
  })

  const lessonStageLabel = computed(() => {
    if (currentStageIndex.value < 0 || currentLessonIndex.value < 0) return ''
    return `${currentStageIndex.value + 1}:${currentLessonIndex.value + 1}`
  })

  const canGoPrev = computed(() => currentLessonIndex.value > 0)

  const canGoNext = computed(
    () => currentStage.value != null &&
      currentLessonIndex.value < currentStage.value.lessons.length - 1
  )

  const canGoPrevStage = computed(() => currentStageIndex.value > 0)

  const canGoNextStage = computed(
    () => currentStageIndex.value < allStages.value.length - 1
  )

  function goPrevLesson() {
    if (!canGoPrev.value || !currentStage.value) return
    stopSessionTimer()
    const lesson = currentStage.value.lessons[currentLessonIndex.value - 1]
    ;(navigateToLesson ?? applyLesson)(lesson)
  }

  function goNextLesson() {
    if (!canGoNext.value || !currentStage.value) return
    stopSessionTimer()
    const lesson = currentStage.value.lessons[currentLessonIndex.value + 1]
    ;(navigateToLesson ?? applyLesson)(lesson)
  }

  function goPrevStage() {
    if (!canGoPrevStage.value) return
    const stage = allStages.value[currentStageIndex.value - 1]
    currentStage.value = stage
    stopSessionTimer()
    applyLesson(stage.lessons[0])
  }

  function goNextStage() {
    if (!canGoNextStage.value) return
    const stage = allStages.value[currentStageIndex.value + 1]
    currentStage.value = stage
    stopSessionTimer()
    applyLesson(stage.lessons[0])
  }

  return {
    currentStageIndex,
    currentLessonIndex,
    lessonProgression,
    stageProgression,
    lessonStageLabel,
    canGoPrev,
    canGoNext,
    canGoPrevStage,
    canGoNextStage,
    goPrevLesson,
    goNextLesson,
    goPrevStage,
    goNextStage,
  }
}
