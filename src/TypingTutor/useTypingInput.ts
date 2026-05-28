import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Lesson, ExerciseMode } from './TypingTypes'
import { AYIN } from '../KeyboardDisplay/HebrewKeyboard'

export function useTypingInput(
  typed: Ref<string>,
  accuracy: Ref<number>,
  wpm: Ref<number>,
  progress: Ref<number>,
  start: Ref<Date | null>,
  lastKey: Ref<string>,
  heldKey: Ref<string>,
  mistakeKey: Ref<string>,
  weak: Ref<Record<string, number>>,
  ayinCorrect: Ref<number>,
  ayinTotal: Ref<number>,
  currentLesson: Ref<Lesson>,
  exerciseMode: Ref<ExerciseMode>,
  currentTarget: Ref<string>,
  sessionExpired: Ref<boolean>,
  startSessionTimer: () => void,
) {
  const englishWarning = ref(false)

  let englishWarningTimer: ReturnType<typeof setTimeout> | null = null
  function triggerEnglishWarning() {
    englishWarning.value = true
    if (englishWarningTimer) clearTimeout(englishWarningTimer)
    englishWarningTimer = setTimeout(() => {
      englishWarning.value = false
      englishWarningTimer = null
    }, 1400)
  }

  let mistakeTimerId: ReturnType<typeof setTimeout> | null = null
  function triggerMistake(key: string) {
    mistakeKey.value = key
    if (mistakeTimerId) clearTimeout(mistakeTimerId)
    mistakeTimerId = setTimeout(() => {
      mistakeKey.value = ''
      mistakeTimerId = null
    }, 360)
  }

  function onKeyDown(event: KeyboardEvent) { heldKey.value = event.key }
  function onKeyUp() { heldKey.value = '' }
  function clearHeldKey() { heldKey.value = '' }

  function onInput(e?: Event) {
    if (sessionExpired.value) return

    if (e && exerciseMode.value !== 'free') {
      const textarea = e.target as HTMLTextAreaElement
      const lastChar = textarea.value.slice(-1)
      if (lastChar && /[a-zA-Z]/.test(lastChar)) {
        triggerEnglishWarning()
        typed.value = textarea.value.slice(0, -1)
        textarea.value = typed.value
        return
      }
    }

    if (!start.value) {
      start.value = new Date()
      startSessionTimer()
    }

    const target = currentTarget.value
    let correct = 0, ayinC = 0, ayinT = 0

    for (let i = 0; i < typed.value.length; i++) {
      const expected = target[i], actual = typed.value[i]
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

    accuracy.value = typed.value.length === 0
      ? 100
      : Math.round((correct / typed.value.length) * 100)

    const elapsed = (new Date().getTime() - start.value!.getTime()) / 1000 / 60
    wpm.value = elapsed > 0 ? Math.round(typed.value.length / 5 / elapsed) : 0
    progress.value = Math.min(100, Math.round((typed.value.length / target.length) * 100))
    lastKey.value = typed.value.slice(-1)
  }

  onUnmounted(() => {
    if (englishWarningTimer) clearTimeout(englishWarningTimer)
    if (mistakeTimerId) clearTimeout(mistakeTimerId)
  })

  return {
    englishWarning,
    triggerEnglishWarning,
    triggerMistake,
    onKeyDown,
    onKeyUp,
    clearHeldKey,
    onInput,
  }
}
