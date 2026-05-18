<template>
  <div class="intro-backdrop" @click.self="handleBackdropClick">
    <div class="intro-card" role="dialog" aria-modal="true" aria-label="מבוא להקלדה עיוורת">

      <!-- Progress dots -->
      <div class="intro-dots" aria-hidden="true">
        <span
          v-for="i in slides.length"
          :key="i"
          class="intro-dot"
          :class="{ active: i - 1 === currentIndex }"
          @click="currentIndex = i - 1"
        />
      </div>

      <!-- Slide content -->
      <transition :name="slideDirection" mode="out-in">
        <div class="intro-slide" :key="currentIndex">
          <div class="intro-slide-number">{{ currentIndex + 1 }} / {{ slides.length }}</div>
          <div class="intro-slide-icon" aria-hidden="true">{{ slides[currentIndex].icon }}</div>
          <h2 class="intro-slide-title">{{ slides[currentIndex].title }}</h2>
          <p class="intro-slide-body">{{ slides[currentIndex].body }}</p>
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
import { ref, computed } from 'vue'

const emit = defineEmits<{
  done: []
  skip: []
}>()

const slides = [
  {
    icon: '⌨️',
    title: 'מהי הקלדה עיוורת?',
    body: 'הקלדה עיוורת משמעותה הקלדה ללא הסתכלות על המקלדת, תוך שימוש בכל עשר האצבעות והסתמכות על זיכרון שרירים במקום על רמזים חזותיים. במקום לחפש מקשים, האצבעות שלך יודעות אוטומטית לאן לפנות. זוהי השקעה חד-פעמית עם תשואות לטווח ארוך.',
  },
  {
    icon: '🏠',
    title: 'שורת הבסיס: העוגן שלך',
    body: 'הנח את אצבעות יד שמאל על המקשים כ, ג, ד, ש ואת אצבעות יד ימין על ח, ל, ך, ף. האגודלים נחים על מקש הרווח. שמונת המקשים הללו הם העוגן שלך — כל הקשה מתחילה ומסתיימת כאן. הבליטות המישושיות נמצאות על המקשים כ (יד שמאל) ו-ח (יד ימין) — הן יעזרו לך למצוא את שורת הבסיס ללא הסתכלות.',
  },
  {
    icon: '🖐️',
    title: 'לכל אצבע העמודה שלה',
    body: 'המקלדת מחולקת לעמודות אנכיות — כל אצבע אחראית על עמודה קבועה בכל השורות. למשל, אצבע המורה של יד שמאל מכסה את כ, ר, ה, ו-4 בכל השורות מלמעלה למטה. לעולם אל תגיע למקש עם האצבע הלא נכונה. שמירה על הכלל הזה מקצרת את המרחק שהאצבעות עוברות, משפרת מהירות ומפחיתה עומס. לשיפט — השתמש תמיד בזרת של היד הנגדית לאות, כך ששתי הידיים עובדות בו-זמנית.',
  },
  {
    icon: '🎯',
    title: 'דיוק לפני מהירות',
    body: 'הטעות הנפוצה ביותר בקרב מתחילים היא ניסיון להקליד מהר מדי בשלב מוקדם. כלל אצבע טוב: אם הדיוק יורד מתחת ל-90%, האט. המהירות היא תוצר לוואי של הדיוק. עקביות חשובה יותר מאינטנסיביות — תרגול קצר כל יום עדיף על מפגשים ארוכים ולא סדירים.',
  },
  {
    icon: '📅',
    title: 'אל תסתכל והישאר עקבי',
    body: 'התנגד לכל דחף להסתכל על המקלדת בזמן ההקלדה. תרגל 15–30 דקות ביום בעקביות. בקצב זה, תתחיל להקליד בשיטה עיוורת תוך כחודש, ועם עוד חודש של תרגול תגיע ל-30–40 מילים לדקה.',
  },
]

const currentIndex = ref(0)
const slideDirection = ref<'slide-next' | 'slide-prev'>('slide-next')

const isLast = computed(() => currentIndex.value === slides.length - 1)

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
  // Don't close on backdrop click — user must explicitly navigate
}
</script>

<style scoped>
.intro-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 16px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.intro-card {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 40px) clamp(20px, 3.5vw, 36px);
  max-width: 480px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 20px;
  direction: rtl;
  animation: cardIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.9) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Progress dots */
.intro-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.intro-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  cursor: pointer;
  transition: background 200ms, transform 200ms;
  flex-shrink: 0;
}

.intro-dot.active {
  background: var(--accent-primary);
  transform: scale(1.25);
}

/* Slide */
.intro-slide {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  min-height: 220px;
  justify-content: center;
}

.intro-slide-number {
  font-size: 11px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.intro-slide-icon {
  font-size: clamp(36px, 6vw, 52px);
  line-height: 1;
}

.intro-slide-title {
  font-size: clamp(17px, 2.8vw, 22px);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.intro-slide-body {
  font-size: clamp(13px, 1.9vw, 15px);
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* Actions */
.intro-actions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.intro-btn {
  flex: 1;
  padding: clamp(10px, 1.8vw, 13px) clamp(14px, 2.5vw, 20px);
  border-radius: 10px;
  font-size: clamp(13px, 1.9vw, 15px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 150ms, transform 120ms;
  font-family: inherit;
}

.intro-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.intro-btn:active { transform: translateY(0); }

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
  transition: opacity 200ms ease, transform 200ms ease;
}

.slide-next-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-next-leave-to   { opacity: 0; transform: translateX(24px); }
.slide-prev-enter-from { opacity: 0; transform: translateX(24px); }
.slide-prev-leave-to   { opacity: 0; transform: translateX(-24px); }
</style>
