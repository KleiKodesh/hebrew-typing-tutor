import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import { curriculumEnglish } from './locales/curriculum.en'

export type UiLanguage = 'he' | 'en'

const STORAGE_KEY = 'ui-language'

const englishByHebrew: Record<string, string> = {
  '← חזרה למאמן': '← Back to Tutor',
  'סימולטור ידיים: מצב ניפוי שגיאות →': 'Debug: Hand Simulator →',
  'בחר משתמש': 'Choose a user',
  'או צור חדש': 'Or create a new one',
  'מחק משתמש': 'Delete user',
  'משתמש חדש': 'New user',
  'ביטול': 'Cancel',
  'מחק': 'Delete',
  'האם אתה בטוח שברצונך למחוק את ': 'Are you sure you want to delete ',
  'כל הנתונים שלו יימחקו.': 'All of this user’s data will be deleted.',
  'הזן את שמך': 'Enter your name',
  'מאמן הקלדה בעברית': 'Hebrew Typing Tutor',
  'הקלדה עברית': 'Hebrew typing',
  'חויית למידה בוגרת ומהנה': 'An engaging adult learning experience',
  'שמך...': 'Your name...',
  'שם': 'Name',
  'התחל': 'Start',
  'מבוא להקלדה עיוורת': 'Introduction to touch typing',
  'עבור לשקופית': 'Go to slide',
  'הקודם': 'Previous',
  'דלג': 'Skip',
  'בואו נתחיל': 'Let’s begin',
  'הבא': 'Next',
  'הקלדה באנגלית — עבור לעברית': 'English keyboard detected — switch to Hebrew',
  'מקלדת ערבית — עבור לעברית': 'Arabic keyboard detected — switch to Hebrew',
  'שיעור הבא': 'Next lesson',
  'שלב הבא': 'Next stage',
  'סיום': 'Finish',
  'עברית': 'Hebrew',
  'החלף לאנגלית': 'Switch to English',
  'החלף לעברית': 'Switch to Hebrew',
  'כבר השלמת את השיעור הזה': 'You have already completed this lesson',
  'המשך': 'Continue',
  'עשה שוב': 'Try again',
  'מחק הכל': 'Delete all',
  'האם אתה בטוח שברצונך למחוק את כל הנתונים?': 'Are you sure you want to delete all your data?',
  'לא ניתן לבטל פעולה זו.': 'This action cannot be undone.',
  'כל הכבוד': 'Well done',
  'עבודה מצוינת': 'Excellent work',
  'מדהים': 'Amazing',
  'ממשיכים קדימה': 'Keep it up',
  'מושלם': 'Perfect',
  '✓ השיעור הושלם': '✓ Lesson complete',
  'משתמש': 'User',
  'משתמשים': 'Users',
  'שלב קודם': 'Previous stage',
  'שיעור קודם': 'Previous lesson',
  'אפס הכל': 'Reset all',
  'מצב בהיר': 'Light mode',
  'מצב אפל': 'Dark mode',
  'דיוק': 'Accuracy',
  'ת/ד': 'Chars/min',
  'תווים/דקה': 'Characters/min',
  'דיוק ע': 'Ayin accuracy',
  'הזרת הימנית (ע) מתחת ל-80% — שקול לחזור על שיעור ע לפני שממשיך.':
    'The right pinky (ע) is below 80% accuracy — consider repeating the ע lesson before continuing.',
  'חזור על השיעור': 'Repeat lesson',
  'קראתי — הסתר והתחל': 'I’ve read it — hide and start',
  'הטקסט מוסתר — הקלד מהזיכרון': 'Text hidden — type from memory',
  'הצג שוב': 'Show text again',
  'הקלד כאן...': 'Type here...',
  'הקלד חופשי...': 'Type freely...',
  '20 דקות הסתיימו': '20 minutes are up',
  'לפי מחקר Baddeley & Longman (1978), שיעור אחד ביום של עד 20 דקות הוא האפקטיבי ביותר.':
    'According to Baddeley & Longman (1978), one lesson of up to 20 minutes per day is most effective.',
  'עצור כאן. חזור מחר.': 'Stop here. Come back tomorrow.',
  'אישור — אחזור מחר': 'Okay — I’ll be back tomorrow',
  'המשך בכל זאת': 'Continue anyway',
  'מבוא לשלב': 'Stage introduction',
  'שפת הממשק': 'Interface language',
  'קוגניטיבי': 'Cognitive',
  'אסוציאטיבי': 'Associative',
  'אוטומציה': 'Automatic',
  'הכרה': 'Recognition',
  'מילים': 'Words',
  'ערבוב': 'Mixed',
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'he',
  fallbackLocale: 'he',
  messageResolver: (messages, path) =>
    messages && typeof messages === 'object' ? Reflect.get(messages, path) : undefined,
  messages: {
    he: Object.fromEntries(Object.keys(englishByHebrew).map((key) => [key, key])),
    en: { ...englishByHebrew, ...curriculumEnglish },
  },
})

const locale = i18n.global.locale

function applyLanguage(language: UiLanguage) {
  localStorage.setItem(STORAGE_KEY, language)
  document.documentElement.lang = language
  document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr'
}

watch(locale, (language) => applyLanguage(language as UiLanguage), {
  immediate: true,
  flush: 'sync',
})

export function setUiLanguage(language: UiLanguage) {
  if (language !== 'he' && language !== 'en') {
    throw new Error(`Unsupported UI language: ${language}`)
  }
  locale.value = language
}
