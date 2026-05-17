<template>
  <div class="typing-page">
    <LessonMenu
      :courses="courses"
      :current-course="currentCourse"
      :current-lesson="currentLesson"
      :safe-lessons="safeLessons"
      :open="menuOpen"
      @select-course="selectCourse"
      @select-lesson="selectLesson"
      @generate-weak="generateWeakLesson"
      @update:open="menuOpen = $event"
    />

    <div class="main">
      <div class="typing-area-wrapper" :class="{ advancing: isAdvancing }">
        <TypingArea
          v-model="typed"
          :display-text="displayText"
          :keyboard="keyboard"
          :last-key="lastKey"
          :held-key="heldKey"
          :next-key="nextKey"
          :mistake-key="mistakeKey"
          :english-warning="englishWarning"
          :can-go-prev="canGoPrev"
          :can-go-next="canGoNext"
          @input="onInput"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          @blur="clearHeldKey"
          @mistake="triggerMistake"
          @english="triggerEnglishWarning"
          @prev-lesson="goPrevLesson"
          @restart-lesson="resetCourse"
          @next-lesson="goNextLesson"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import courses from './lessons.json'
import LessonMenu from './components/LessonMenu.vue'
import TypingArea from './components/TypingCard.vue'
import { useTyping, Lesson } from './composables/useTyping'

interface Course {
  title: string
  lessons: Lesson[]
}

const currentCourse = ref<Course>(courses[0])
const menuOpen = ref(false)

const {
  typed,
  accuracy,
  wpm,
  progress,
  heldKey,
  lastKey,
  nextKey,
  mistakeKey,
  englishWarning,
  isComplete,
  currentLesson,
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
} = useTyping(currentCourse.value.lessons[0])

const safeLessons = computed(() => currentCourse.value.lessons)

const currentIndex = computed(() =>
  safeLessons.value.findIndex((lesson) => lesson === currentLesson.value)
)

const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value + 1 < safeLessons.value.length)

function goPrevLesson() {
  if (!canGoPrev.value) {
    return
  }
  selectLesson(safeLessons.value[currentIndex.value - 1])
}

function goNextLesson() {
  if (!canGoNext.value) {
    return
  }
  selectLesson(safeLessons.value[currentIndex.value + 1])
}

function resetCourse() {
  if (safeLessons.value.length === 0) {
    return
  }
  clearAllProgress()
  selectLesson(safeLessons.value[0])
}

const isAdvancing = ref(false)
let advanceTimer: number | null = null

watch(isComplete, (complete) => {
  if (!complete || isAdvancing.value) {
    return
  }

  const currentIndex = safeLessons.value.findIndex(
    (lesson) => lesson === currentLesson.value
  )

  if (currentIndex === -1 || currentIndex + 1 >= safeLessons.value.length) {
    return
  }

  isAdvancing.value = true
  advanceTimer = window.setTimeout(() => {
    selectLesson(safeLessons.value[currentIndex + 1])
    isAdvancing.value = false
    advanceTimer = null
  }, 420)
})

const keyboard = [
  ['ESC', '`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
  ['Tab', 'ק', 'ו', 'ע', 'פ', 'א', 'ר', 'ש', 'ד', 'ג', 'כ', 'ל', 'ח', '[{', ']}', '"\'', '\\|'],
  ['Caps', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', ';:', '.>', 'Enter'],
  ['Shift', ',<', 'ש', 'ך', 'ם', 'ן', 'ל', '/?', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
]

function selectCourse(course: Course) {
  currentCourse.value = course
  selectLesson(course.lessons[0])
  menuOpen.value = false
}
</script>

<style>
*{
  box-sizing:border-box;
}
html{
  direction: rtl;
  font-family: Inter, Arial, sans-serif;
  min-height: 100%;
}
body{
  margin: 0;
  background: #eff3fb;
  min-height: 100vh;
}
.typing-page{
  min-height: 100vh;
  padding: 10px 12px calc(env(safe-area-inset-bottom, 16px) + 10px) 12px;
  background: #eef2f6;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.main{
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 10px;
}

.typing-area-wrapper{
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  transition: opacity 280ms ease, transform 280ms ease;
}
.typing-area-wrapper.advancing{
  opacity: 0.8;
  transform: translateY(-8px);
}
@media (max-width: 520px) {
  .typing-page{
    padding: 10px 10px calc(env(safe-area-inset-bottom, 10px) + 10px) 10px;
  }
  .page-title{
    font-size: 16px;
  }
  .fluent-input{
    min-height: 110px;
  }
}
</style>
