<template>
  <div class="user-dropdown-wrap" ref="wrapEl">
    <!-- Trigger button -->
    <button
      class="user-trigger"
      :class="{ open: isOpen }"
      @click="toggle"
      :title="userName || 'משתמש'"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <span v-if="userName" class="user-initial">{{ userName[0] }}</span>
      <svg v-else class="trigger-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dropdown panel -->
    <Teleport to="body">
      <transition name="dropdown">
        <div v-if="isOpen" ref="panelEl" class="dropdown-panel" role="listbox" :aria-label="'בחר משתמש'" :style="dropdownStyle">

          <!-- Existing users -->
          <div v-if="allUsers.length" class="dropdown-section">
            <div class="dropdown-section-label">משתמשים</div>
            <button
              v-for="user in allUsers"
              :key="user"
              class="dropdown-item"
              :class="{ active: user === userName }"
              role="option"
              :aria-selected="user === userName"
              @click="selectUser(user)"
            >
              <span class="item-initial">{{ user[0] }}</span>
              <span class="item-name">{{ user }}</span>
              <svg v-if="user === userName" class="item-check" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <button
                class="item-delete"
                @click="handleDeleteUser($event, user)"
                title="מחק משתמש"
                aria-label="מחק משתמש"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M19 6L5 20M5 6L19 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </button>
          </div>

          <div v-if="allUsers.length" class="dropdown-divider" />

          <!-- Add new user -->
          <div class="dropdown-section">
            <button
              class="dropdown-item new-user-btn"
              @click="submitNewUser"
            >
              <svg class="item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 8v6M16 11h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <span>משתמש חדש</span>
            </button>
          </div>

        </div>
      </transition>
    </Teleport>

    <!-- Delete confirmation dialog -->
    <ConfirmDialog
      :is-open="!!deleteConfirmUser"
      cancel-label="ביטול"
      confirm-label="מחק"
      @confirm="confirmDelete"
      @cancel="deleteConfirmUser = null"
    >
      <template #message>
        <span>האם אתה בטוח שברצונך למחוק את </span>
        <span class="delete-name">{{ deleteConfirmUser }}</span>
        <span>?</span>
      </template>
      <template #warning>
        כל הנתונים שלו יימחקו.
      </template>
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useUserProfile } from '../composables/useUserProfile'
import ConfirmDialog from './ConfirmDialog.vue'

const emit = defineEmits<{
  'new-user': []
  'user-deleted': []
}>()

const { userName, allUsers, switchUser, deleteUser } = useUserProfile()

const isOpen = ref(false)
const wrapEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const deleteConfirmUser = ref<string | null>(null)
const dropdownStyle = ref<{ top: string; left: string }>({ top: '0', left: '0' })

function updateDropdownPosition() {
  if (!wrapEl.value) return
  const rect = wrapEl.value.getBoundingClientRect()
  dropdownStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
  }
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => updateDropdownPosition())
  } else {
    resetForm()
  }
}

function close() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  // no-op now
}

function selectUser(name: string) {
  switchUser(name)
  close()
}

function handleDeleteUser(e: Event, name: string) {
  e.stopPropagation()
  deleteConfirmUser.value = name
}

function confirmDelete() {
  if (deleteConfirmUser.value) {
    const wasActive = deleteConfirmUser.value === userName.value
    deleteUser(deleteConfirmUser.value)
    deleteConfirmUser.value = null
    if (wasActive) {
      emit('user-deleted')
    }
  }
}

function submitNewUser() {
  close()
  emit('new-user')
}

// Close on outside click
function onDocClick(e: MouseEvent) {
  if (wrapEl.value && !wrapEl.value.contains(e.target as Node)) {
    if (panelEl.value && !panelEl.value.contains(e.target as Node)) {
      close()
    }
  }
}

onMounted(() => document.addEventListener('mousedown', onDocClick))
onUnmounted(() => document.removeEventListener('mousedown', onDocClick))
</script>

<style scoped>
.user-dropdown-wrap {
  position: relative;
  flex-shrink: 0;
}

/* Trigger */
.user-trigger {
  width: clamp(28px, 4.5vw, 36px);
  height: clamp(28px, 4.5vw, 36px);
  padding: 0;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  flex-shrink: 0;
}

.user-trigger:hover,
.user-trigger.open {
  color: var(--accent-primary);
  box-shadow: 0 18px 36px rgba(16, 20, 40, 0.08);
  border-color: rgba(0, 120, 212, 0.35);
  transform: translateY(-1px);
}

.user-trigger:active { transform: translateY(0); }

.user-initial {
  font-size: clamp(11px, 1.8vw, 14px);
  font-weight: 700;
  color: var(--accent-primary);
  line-height: 1;
}

.trigger-icon {
  width: clamp(12px, 2vw, 16px);
  height: clamp(12px, 2vw, 16px);
}

/* Panel */
.dropdown-panel {
  position: fixed;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  z-index: 400;
  overflow: hidden;
  min-width: 200px;
  max-width: 300px;
}

.dropdown-section {
  padding: 6px 4px;
}

.dropdown-section-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 10px 2px;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 0 8px;
}

/* Items */
.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: clamp(12px, 1.8vw, 14px);
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  text-align: right;
  transition: background 140ms;
  font-family: inherit;
}

.dropdown-item:hover {
  background: var(--bg-tertiary);
}

.dropdown-item.active {
  color: var(--accent-primary);
  font-weight: 700;
}

.item-initial {
  width: 24px;
  height: 24px;
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

.item-name {
  flex: 1;
}

.item-check {
  width: 14px;
  height: 14px;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.item-delete {
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 140ms;
}

.item-delete:hover {
  color: var(--error-color);
}

.item-delete svg {
  width: 100%;
  height: 100%;
}

.item-icon {
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.new-user-btn {
  color: var(--text-secondary);
}

/* Delete confirmation dialog */
.delete-name {
  font-weight: 700;
  color: var(--text-primary);
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
