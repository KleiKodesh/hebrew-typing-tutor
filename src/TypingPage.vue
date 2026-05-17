<template>
  <div class="typing-page">
    <aside class="sidebar" :class="{open: menuOpen}">
      <div class="sidebar-header">
        <h2>תפריט שיעורים</h2>
        <button class="close-menu" @click="closeMenu" aria-label="סגור תפריט">×</button>
      </div>

      <div class="list">
        <div
          v-for="course in courses"
          :key="course.title"
          class="course"
          :class="{active: course === currentCourse}"
          @click="selectCourse(course)"
        >
          {{ course.title }}
        </div>

        <div
          v-for="lesson in safeLessons"
          :key="lesson.title"
          class="lesson"
          :class="{active: lesson === currentLesson}"
          @click="selectLesson(lesson)"
        >
          {{ lesson.title }}
        </div>
      </div>

      <button class="menu-action" @click="generateWeakLesson">
        תרגיל חיזוק
      </button>
    </aside>
    <div class="drawer-backdrop" v-if="menuOpen" @click="closeMenu"></div>

    <div class="main">
      <div class="lesson-description" v-if="currentLesson.text">
        {{ currentLesson.text }}
      </div>
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
          :can-go-prev-stage="canGoPrevStage"
          :can-go-next-stage="canGoNextStage"
          @input="onInput"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          @blur="clearHeldKey"
          @mistake="triggerMistake"
          @english="triggerEnglishWarning"
          @prev-lesson="goPrevLesson"
          @restart-lesson="resetCourse"
          @next-lesson="goNextLesson"
          @prev-stage="goPrevStage"
          @next-stage="goNextStage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import TypingArea from './components/TypingCard.vue'
import { useTyping, Lesson } from './composables/useTyping'

interface Course {
  stage_id?: string
  title: string
  description?: string
  lessons: Lesson[]
}

const courses = ref<Course[]>([])
const currentCourse = ref<Course>({
  title: 'טוען שיעורים...',
  lessons: []
})
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
} = useTyping({ title: '', text: '' })

async function loadCourses() {
  try {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const stageFiles = [
      'stage_1.json',
      'stage_2.json',
      'stage_3.json',
      'stage_4.json',
      'stage_5.json',
      'stage_6.json'
    ].map((file) => `${baseUrl}${file}`)

    const loadedCourses = await Promise.all(
      stageFiles.map(async (path) => {
        const res = await fetch(path)
        if (!res.ok) {
          throw new Error(`Failed to load ${path}: ${res.status}`)
        }

        const json = await res.json()
        return {
          stage_id: json.stage_id,
          title: json.stage_title,
          description: json.description,
          lessons: json.lessons.map((lesson: any) => ({
            title: lesson.title,
            text: lesson.text,
            exercise: lesson.exercise
          }))
        } as Course
      })
    )

    courses.value = loadedCourses.sort((a, b) => {
      const aIndex = parseInt(a.stage_id?.replace('stage_', '') || '0', 10)
      const bIndex = parseInt(b.stage_id?.replace('stage_', '') || '0', 10)
      return aIndex - bIndex
    })

    if (courses.value.length > 0) {
      selectCourse(courses.value[0])
    }
  } catch (error) {
    console.error('Error loading stage data:', error)
  }
}

onMounted(() => {
  loadCourses()
})

const safeLessons = computed(() => currentCourse.value.lessons)

const currentIndex = computed(() =>
  safeLessons.value.findIndex((lesson) => lesson === currentLesson.value)
)

const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value + 1 < safeLessons.value.length)

const currentCourseIndex = computed(() =>
  courses.value.findIndex((course) => course === currentCourse.value)
)

const canGoPrevStage = computed(() => currentCourseIndex.value > 0)
const canGoNextStage = computed(() => currentCourseIndex.value + 1 < courses.value.length)

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

function goPrevStage() {
  if (!canGoPrevStage.value) {
    return
  }
  selectCourse(courses.value[currentCourseIndex.value - 1])
}

function goNextStage() {
  if (!canGoNextStage.value) {
    return
  }
  selectCourse(courses.value[currentCourseIndex.value + 1])
}

function resetCourse() {
  if (safeLessons.value.length === 0) {
    return
  }
  clearAllProgress()
  selectLesson(safeLessons.value[0])
}

function closeMenu() {
  menuOpen.value = false
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
  if (course.lessons.length > 0) {
    selectLesson(course.lessons[0])
  }
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
  overflow: hidden;
}
body{
  margin: 0;
  background: #eff3fb;
  min-height: 100vh;
  overflow: hidden;
}
.typing-page{
  min-height: 100vh;
  padding: 8px 10px calc(env(safe-area-inset-bottom, 12px) + 8px) 10px;
  background: #eef2f6;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
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
.lesson-description{
  padding: 8px 10px;
  background: rgba(59,130,246,0.08);
  border-radius: 10px;
  color: #1e293b;
  line-height: 1.5;
  font-size: 13px;
  white-space: pre-wrap;
  margin-bottom: 0;
  flex-shrink: 0;
}
.sidebar{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 86%;
  max-width: 320px;
  background: linear-gradient(180deg,#ffffff,#fbfdff);
  padding: 12px;
  overflow: auto;
  transform: translateX(100%);
  transition: transform 0.22s cubic-bezier(.2,.9,.2,1);
  box-shadow: -12px 24px 48px rgba(16,24,40,0.12);
  z-index: 60;
}
.sidebar.open{transform: translateX(0)}
.sidebar-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}
.sidebar-header h2{margin:0;font-size:16px}
.close-menu{background:none;border:none;font-size:22px;cursor:pointer;line-height:1}
.list{display:flex;flex-direction:column;gap:8px}
.course,.lesson{
  padding:10px 12px;
  border-radius:10px;
  cursor:pointer;
  background:transparent;
  text-align:right;
  font-size:14px;
  border:1px solid rgba(16,24,40,0.04);
}
.active{background:linear-gradient(90deg,#2f6fed,#3b82f6);color:white;border:1px solid rgba(16,24,40,0.06)}
.menu-action{background:#eef2ff;border:none;padding:10px;border-radius:12px;cursor:pointer;width:100%}
.drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.28);z-index:50}

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
