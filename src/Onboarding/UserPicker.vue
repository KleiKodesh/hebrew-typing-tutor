<template>
  <div class="picker-backdrop">
    <div class="picker-card" role="dialog" aria-modal="true" aria-label="בחר משתמש">

      <div class="picker-icon" aria-hidden="true">👋</div>
      <h2 class="picker-title">ברוך הבא</h2>
      <p class="picker-subtitle">בחר משתמש קיים או צור חדש</p>

      <!-- Existing users -->
      <div class="user-list">
        <button
          v-for="user in allUsers"
          :key="user"
          class="user-item"
          @click="$emit('select', user)"
        >
          <span class="user-avatar">{{ user[0] }}</span>
          <span class="user-name">{{ user }}</span>
          <svg class="user-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="picker-divider" />

      <!-- New user -->
      <button class="new-user-btn" @click="$emit('new')">
        <span class="new-user-avatar">+</span>
        <span>משתמש חדש</span>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserProfile } from '../composables/useUserProfile'

const { allUsers } = useUserProfile()

defineEmits<{
  select: [name: string]
  new: []
}>()
</script>

<style scoped>
.picker-backdrop {
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

.picker-card {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 40px) clamp(20px, 3.5vw, 36px);
  max-width: 380px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 14px;
  direction: rtl;
  text-align: center;
  animation: cardIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.9) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.picker-icon {
  font-size: clamp(36px, 6vw, 50px);
  line-height: 1;
}

.picker-title {
  font-size: clamp(20px, 3.2vw, 26px);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.picker-subtitle {
  font-size: clamp(13px, 1.9vw, 15px);
  color: var(--text-secondary);
  margin: 0;
}

/* User list */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(10px, 1.8vw, 13px) clamp(12px, 2vw, 16px);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 600;
  font-family: inherit;
  transition: background 140ms, border-color 140ms, transform 120ms;
  width: 100%;
}

.user-item:hover {
  background: var(--bg-tertiary);
  border-color: rgba(0, 120, 212, 0.3);
  transform: translateY(-1px);
}

.user-item:active { transform: translateY(0); }

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(0, 120, 212, 0.12);
  color: var(--accent-primary);
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  flex: 1;
}

.user-arrow {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

/* Divider */
.picker-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 0 -4px;
}

/* New user button */
.new-user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(10px, 1.8vw, 13px) clamp(12px, 2vw, 16px);
  border-radius: 12px;
  border: 1.5px dashed var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: clamp(13px, 1.9vw, 15px);
  font-weight: 600;
  font-family: inherit;
  width: 100%;
  transition: border-color 140ms, color 140ms, transform 120ms;
}

.new-user-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-1px);
}

.new-user-btn:active { transform: translateY(0); }

.new-user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px dashed currentColor;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}
</style>
