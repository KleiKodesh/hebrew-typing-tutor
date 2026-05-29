<template>
  <div class="intro-backdrop" @click.self="handleBackdropClick">
    <div class="intro-card" role="dialog" aria-modal="true" aria-label="מבוא להקלדה עיוורת">

      <!-- Progress dots -->
      <div class="intro-dots" aria-hidden="true">
        <button
          v-for="i in slideCount"
          :key="i"
          class="intro-dot"
          :class="{ active: i - 1 === currentIndex }"
          @click="currentIndex = i - 1"
          :aria-label="`עבור לשקופית ${i}`"
        />
      </div>

      <!-- Slide content -->
      <transition :name="slideDirection" mode="out-in">
        <div v-if="slideCount > 0 && currentSlide" class="intro-slide" :key="currentIndex">
          <div class="intro-slide-number">{{ currentIndex + 1 }} / {{ slideCount }}</div>
          <h2 class="intro-slide-title">{{ currentSlide.title }}</h2>
          <p class="intro-slide-body">{{ currentSlide.body }}</p>
        </div>
      </transition>

      <!-- Navigation -->
      <div class="intro-actions">
        <button
          v-if="currentIndex > 0"
          class="intro-btn secondary"
          @click="prev"
        >
          הקודם
        </button>
        <button
          v-else
          class="intro-btn ghost"
          @click="$emit('skip')"
        >
          דלג
        </button>

        <button
          class="intro-btn primary"
          @click="next"
        >
          {{ isLast ? 'בואו נתחיל' : 'הבא' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { introSlides } from 'virtual:intro-slides'

const emit = defineEmits<{
  done: []
  skip: []
}>()

const slides = ref<Array<{ title: string; body: string }>>([])
const isLoaded = ref(false)

onMounted(async () => {
  try {
    const loaded = await Promise.resolve(introSlides)
    if (Array.isArray(loaded)) {
      slides.value = loaded
    } else {
      slides.value = []
    }
  } catch (error) {
    console.error('Failed to load intro slides:', error)
    slides.value = []
  }
  isLoaded.value = true
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const currentIndex = ref(0)
const slideDirection = ref<'slide-next' | 'slide-prev'>('slide-next')

const slideCount = computed(() => slides.value.length)
const isLast = computed(() => currentIndex.value === slides.value.length - 1)
const currentSlide = computed(() => {
  if (slides.value.length === 0) return null
  return slides.value[currentIndex.value] || null
})

function next() {
  if (isLast.value) {
    emit('done')
    return
  }
  slideDirection.value = 'slide-next'
  currentIndex.value++
}

function prev() {
  if (currentIndex.value === 0) return
  slideDirection.value = 'slide-prev'
  currentIndex.value--
}

function handleBackdropClick() {
  // Don't close on backdrop click
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    // Only advance if not focused on an input/textarea/button
    const tag = (document.activeElement && document.activeElement.tagName) || ''
    if (!['INPUT', 'TEXTAREA', 'BUTTON'].includes(tag)) {
      next()
    }
  }
}
</script>

<style scoped>
.intro-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 16px;
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
}

.intro-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  max-width: 380px;
  width: 100%;
  box-shadow:
    0 1px 2px rgba(0,0,0,0.06),
    0 4px 12px rgba(0,0,0,0.08),
    0 16px 40px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: center;
  overflow: hidden;
  animation: cardIn 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.97) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Progress dots */
.intro-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  padding: clamp(16px, 2.8vw, 20px) clamp(16px, 2.8vw, 20px) clamp(12px, 2vw, 16px);
}

.intro-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
  cursor: pointer;
  transition: background 200ms, transform 200ms;
  flex-shrink: 0;
  border: none;
  padding: 0;
}

.intro-dot:hover {
  background: var(--text-tertiary);
}

.intro-dot.active {
  background: var(--accent-primary);
  transform: scale(1.3);
}

/* Slide */
.intro-slide {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: clamp(16px, 2.8vw, 24px) clamp(20px, 3.5vw, 28px);
  min-height: 160px;
  justify-content: center;
}

.intro-slide-number {
  font-size: 10px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.intro-slide-title {
  font-size: clamp(17px, 2.6vw, 20px);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.intro-slide-body {
  font-size: clamp(12px, 1.8vw, 13px);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}

/* Actions */
.intro-actions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  padding: clamp(12px, 2vw, 16px) clamp(16px, 2.8vw, 20px) clamp(16px, 2.8vw, 20px);
  border-top: 1px solid var(--border-subtle);
}

.intro-btn {
  flex: 1;
  padding: clamp(8px, 1.4vw, 10px) clamp(12px, 2vw, 16px);
  border-radius: 4px;
  font-size: clamp(12px, 1.8vw, 13px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 120ms, background 120ms;
  font-family: inherit;
}

.intro-btn:hover { opacity: 0.88; }
.intro-btn:active { opacity: 0.76; }

.intro-btn.primary {
  background: var(--accent-primary);
  color: #fff;
}

.intro-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.intro-btn.ghost {
  background: transparent;
  color: var(--text-tertiary);
  border: 1px solid var(--border-subtle);
}

/* Slide transitions */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.slide-next-enter-from { opacity: 0; transform: translateX(-16px); }
.slide-next-leave-to   { opacity: 0; transform: translateX(16px); }
.slide-prev-enter-from { opacity: 0; transform: translateX(16px); }
.slide-prev-leave-to   { opacity: 0; transform: translateX(-16px); }
</style>
