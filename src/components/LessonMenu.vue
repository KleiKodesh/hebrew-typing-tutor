<template>
  <aside class="sidebar" :class="{open}">
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
  <div class="drawer-backdrop" v-if="open" @click="closeMenu"></div>
</template>

<script setup lang="ts">
interface Lesson {
  title: string
  text: string
}

interface Course {
  title: string
  lessons: Lesson[]
}

const props = defineProps<{
  courses: Course[]
  currentCourse: Course
  currentLesson: Lesson
  safeLessons: Lesson[]
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'select-course', course: Course): void
  (e: 'select-lesson', lesson: Lesson): void
  (e: 'generate-weak'): void
  (e: 'update:open', open: boolean): void
}>()

const selectCourse = (course: Course) => emit('select-course', course)
const selectLesson = (lesson: Lesson) => emit('select-lesson', lesson)
const generateWeakLesson = () => emit('generate-weak')
const closeMenu = () => emit('update:open', false)
</script>

<style scoped>
.sidebar{
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  width:86%;
  max-width:320px;
  background:linear-gradient(180deg,#ffffff,#fbfdff);
  padding:12px;
  overflow:auto;
  transform: translateX(100%);
  transition: transform 0.22s cubic-bezier(.2,.9,.2,1);
  box-shadow:-12px 24px 48px rgba(16,24,40,0.12);
  z-index:60;
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
</style>
