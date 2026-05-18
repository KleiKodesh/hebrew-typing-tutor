<template>
  <div class="picker-backdrop">
    <div class="picker-card" role="dialog" aria-modal="true" aria-label="בחר משתמש">

      <div class="picker-header">
        <h1 class="picker-title">בחר משתמש</h1>
        <p class="picker-subtitle">או צור חדש</p>
      </div>

      <div class="picker-divider" />

      <!-- Existing users -->
      <div class="user-list">
        <div v-for="user in allUsers" :key="user" class="user-item-wrap">
          <button
            class="user-item"
            @click="$emit('select', user)"
          >
            <span class="user-avatar">{{ user[0] }}</span>
            <span class="user-name">{{ user }}</span>
            <svg class="user-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="user-delete"
            @click="openDeleteConfirm(user)"
            title="מחק משתמש"
            aria-label="מחק משתמש"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M19 6L5 20M5 6L19 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="picker-divider" />

      <!-- New user -->
      <button class="new-user-btn" @click="$emit('new')">
        <span class="new-user-avatar">+</span>
        <span>משתמש חדש</span>
      </button>

    </div>

    <!-- Delete confirmation dialog -->
    <transition name="dialog">
      <div v-if="deleteConfirmUser" class="delete-backdrop" @click.self="deleteConfirmUser = null">
        <div class="delete-dialog">
          <div class="delete-message">
            <span>האם אתה בטוח שברצונך למחוק את </span>
            <span class="delete-name">{{ deleteConfirmUser }}</span>
            <span>?</span>
          </div>
          <div class="delete-warning">כל הנתונים שלו יימחקו.</div>
          <div class="delete-actions">
            <button class="delete-btn cancel" @click="deleteConfirmUser = null">ביטול</button>
            <button class="delete-btn confirm" @click="confirmDelete">מחק</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserProfile } from '../composables/useUserProfile'

const emit = defineEmits<{
  select: [name: string]
  new: []
}>()

const { allUsers, deleteUser } = useUserProfile()

const deleteConfirmUser = ref<string | null>(null)

function openDeleteConfirm(user: string) {
  deleteConfirmUser.value = user
}

function confirmDelete() {
  if (deleteConfirmUser.value) {
    deleteUser(deleteConfirmUser.value)
    deleteConfirmUser.value = null
  }
}
</script>

<style scoped>
.picker-backdrop {
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

.picker-card {
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

/* Header */
.picker-header {
  padding: clamp(24px, 4vw, 36px) clamp(24px, 4vw, 32px) clamp(18px, 3vw, 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.picker-title {
  font-size: clamp(18px, 2.8vw, 22px);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.picker-subtitle {
  font-size: clamp(11px, 1.6vw, 12px);
  color: var(--text-tertiary);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Divider */
.picker-divider {
  height: 1px;
  background: var(--border-subtle);
}

/* User list */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: clamp(8px, 1.5vw, 12px) clamp(8px, 1.5vw, 12px);
}

.user-item-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(9px, 1.6vw, 12px) clamp(12px, 2vw, 14px);
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: clamp(13px, 1.9vw, 14px);
  font-weight: 500;
  font-family: inherit;
  transition: background 120ms;
  width: 100%;
  text-align: right;
  flex: 1;
}

.user-item:hover {
  background: var(--bg-tertiary);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 120, 212, 0.12);
  color: var(--accent-primary);
  font-size: 12px;
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
  width: 14px;
  height: 14px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.user-delete {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 4px;
  transition: color 120ms, background 120ms;
}

.user-delete:hover {
  color: var(--error-color);
  background: rgba(232, 27, 35, 0.08);
}

.user-delete svg {
  width: 16px;
  height: 16px;
}

/* New user button */
.new-user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(9px, 1.6vw, 12px) clamp(12px, 2vw, 14px);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: clamp(13px, 1.9vw, 14px);
  font-weight: 600;
  font-family: inherit;
  width: calc(100% - 16px);
  margin: clamp(8px, 1.5vw, 12px) clamp(8px, 1.5vw, 12px);
  transition: border-color 120ms, color 120ms;
  text-align: right;
}

.new-user-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.new-user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  font-size: 16px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}

/* Delete confirmation dialog */
.delete-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.delete-dialog {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px 24px;
  max-width: 300px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: dialogIn 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes dialogIn {
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.delete-message {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  text-align: right;
}

.delete-name {
  font-weight: 700;
  color: var(--text-primary);
}

.delete-warning {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.5;
  text-align: right;
}

.delete-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}

.delete-btn {
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: opacity 140ms;
}

.delete-btn.cancel {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.delete-btn.cancel:hover { opacity: 0.8; }

.delete-btn.confirm {
  background: var(--error-color);
  color: #fff;
}

.delete-btn.confirm:hover { opacity: 0.88; }

/* Transition */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 200ms ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
