<template>
  <div class="name-backdrop">
    <div class="name-card" role="dialog" aria-modal="true" aria-label="הזן את שמך">
      <div class="name-icon" aria-hidden="true">👋</div>
      <h2 class="name-title">מה שמך?</h2>
      <p class="name-subtitle">
        השם ישמש לעקוב אחר ההתקדמות שלך ולברך אותך לאורך הדרך.
      </p>

      <form class="name-form" @submit.prevent="submit">
        <input
          ref="inputEl"
          v-model="nameInput"
          class="name-input"
          type="text"
          placeholder="הקלד את שמך..."
          maxlength="40"
          autocomplete="given-name"
          dir="auto"
          aria-label="שם"
        />
        <button
          type="submit"
          class="name-btn primary"
          :disabled="!nameInput.trim()"
        >
          בואו נתחיל
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
  // Small delay so the card animation finishes before focusing
  setTimeout(() => inputEl.value?.focus(), 320)
})

function submit() {
  const trimmed = nameInput.value.trim()
  if (!trimmed) return
  emit('done', trimmed)
}
</script>

<style scoped>
.name-backdrop {
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

.name-card {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: clamp(28px, 4.5vw, 44px) clamp(24px, 4vw, 40px);
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 16px;
  direction: rtl;
  text-align: center;
  animation: cardIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.9) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.name-icon {
  font-size: clamp(40px, 7vw, 56px);
  line-height: 1;
}

.name-title {
  font-size: clamp(20px, 3.2vw, 26px);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.name-subtitle {
  font-size: clamp(13px, 1.9vw, 15px);
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
}

.name-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.name-input {
  width: 100%;
  padding: clamp(10px, 1.8vw, 14px) clamp(12px, 2vw, 16px);
  font-size: clamp(14px, 2.2vw, 17px);
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  text-align: center;
  transition: border-color 180ms, box-shadow 180ms;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.12);
}

.name-input::placeholder {
  color: var(--text-tertiary);
}

.name-btn {
  width: 100%;
  padding: clamp(10px, 1.8vw, 13px) clamp(14px, 2.5vw, 20px);
  border-radius: 10px;
  font-size: clamp(13px, 1.9vw, 15px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 150ms, transform 120ms;
  font-family: inherit;
}

.name-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.name-btn:active:not(:disabled) { transform: translateY(0); }
.name-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.name-btn.primary {
  background: var(--accent-primary);
  color: #fff;
}

.name-btn.ghost {
  background: transparent;
  color: var(--text-tertiary);
  border: 1px solid var(--border-subtle);
  margin-top: 2px;
}
</style>
