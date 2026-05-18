<template>
  <div class="name-backdrop">
    <div class="name-card" role="dialog" aria-modal="true" aria-label="הזן את שמך">

      <div class="name-header">
        <span class="name-logo" aria-hidden="true">⌨️</span>
        <h1 class="name-title">הקלדה עברית</h1>
        <p class="name-subtitle">חויית למידה בוגרת ומהנה</p>
      </div>

      <div class="name-divider" />

      <form class="name-form" @submit.prevent="submit">
        <input
          ref="inputEl"
          v-model="nameInput"
          class="name-input"
          type="text"
          placeholder="שמך..."
          maxlength="40"
          autocomplete="given-name"
          dir="rtl"
          aria-label="שם"
        />
        <button
          type="submit"
          class="name-btn"
          :disabled="!nameInput.trim()"
        >
          התחל
        </button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  done: [name: string]
}>()

const nameInput = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

onMounted(() => {
  setTimeout(() => inputEl.value?.focus(), 240)
})

function submit() {
  const trimmed = nameInput.value.trim()
  if (!trimmed) return
  emit('done', trimmed)
}
</script>

<style scoped>
/* Fluent-style backdrop — heavy blur, very light scrim */
.name-backdrop {
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

/* Fluent card — thin border, layered shadow, no heavy radius */
.name-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  max-width: 340px;
  width: 100%;
  box-shadow:
    0 1px 2px rgba(0,0,0,0.06),
    0 4px 12px rgba(0,0,0,0.08),
    0 16px 40px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow: hidden;
  animation: cardIn 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.97) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Header — clean, no gradient */
.name-header {
  padding: clamp(24px, 4vw, 36px) clamp(24px, 4vw, 32px) clamp(18px, 3vw, 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.name-logo {
  font-size: clamp(28px, 4.5vw, 36px);
  line-height: 1;
  margin-bottom: 4px;
  opacity: 0.85;
}

.name-title {
  font-size: clamp(18px, 2.8vw, 22px);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

/* Accent underline on the title */
.name-title::after {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  background: var(--accent-primary);
  border-radius: 1px;
  margin: 6px auto 0;
}

.name-subtitle {
  font-size: clamp(11px, 1.6vw, 12px);
  color: var(--text-tertiary);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Divider */
.name-divider {
  height: 1px;
  background: var(--border-subtle);
}

/* Form */
.name-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: clamp(16px, 2.8vw, 22px) clamp(24px, 4vw, 32px) clamp(20px, 3.2vw, 28px);
}

.name-input {
  width: 100%;
  padding: 8px 12px;
  font-size: clamp(13px, 1.9vw, 14px);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  text-align: center;
  transition: border-color 120ms, box-shadow 120ms;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 1px var(--accent-primary);
}

.name-input::placeholder {
  color: var(--text-tertiary);
}

/* Fluent primary button */
.name-btn {
  width: 100%;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: clamp(13px, 1.9vw, 14px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: var(--accent-primary);
  color: #fff;
  font-family: inherit;
  transition: background 120ms, opacity 120ms;
}

.name-btn:hover:not(:disabled) { background: #106ebe; }
.name-btn:active:not(:disabled) { background: #005a9e; }
.name-btn:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
