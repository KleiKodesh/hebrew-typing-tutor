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
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel" role="listbox" :aria-label="'בחר משתמש'">

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
          </button>
        </div>

        <div v-if="allUsers.length" class="dropdown-divider" />

        <!-- Add new user -->
        <div class="dropdown-section">
          <div v-if="!showNewUserInput" class="dropdown-section-label">הוסף משתמש</div>
          <button
            v-if="!showNewUserInput"
            class="dropdown-item new-user-btn"
            @click="openNewUserInput"
          >
            <svg class="item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 8v6M16 11h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span>משתמש חדש</span>
          </button>

          <!-- Inline new-user form -->
          <form v-else class="new-user-form" @submit.prevent="submitNewUser">
            <input
              ref="newUserInputEl"
              v-model="newUserName"
              class="new-user-input"
              type="text"
              placeholder="שם המשתמש..."
              maxlength="40"
              dir="auto"
              aria-label="שם משתמש חדש"
            />
            <div class="new-user-actions">
              <button type="button" class="new-user-cancel" @click="cancelNewUser">ביטול</button>
              <button type="submit" class="new-user-confirm" :disabled="!newUserName.trim()">הוסף</button>
            </div>
          </form>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useUserProfile } from '../composables/useUserProfile'

const { userName, allUsers, switchUser, addUser } = useUserProfile()

const isOpen = ref(false)
const showNewUserInput = ref(false)
const newUserName = ref('')
const wrapEl = ref<HTMLElement | null>(null)
const newUserInputEl = ref<HTMLInputElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) resetForm()
}

function close() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  showNewUserInput.value = false
  newUserName.value = ''
}

function selectUser(name: string) {
  switchUser(name)
  close()
}

function openNewUserInput() {
  showNewUserInput.value = true
  nextTick(() => newUserInputEl.value?.focus())
}

function cancelNewUser() {
  resetForm()
}

function submitNewUser() {
  const trimmed = newUserName.value.trim()
  if (!trimmed) return
  addUser(trimmed)
  close()
}

// Close on outside click
function onDocClick(e: MouseEvent) {
  if (wrapEl.value && !wrapEl.value.contains(e.target as Node)) {
    close()
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
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 200px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  z-index: 400;
  overflow: hidden;
  direction: rtl;
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

.item-icon {
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.new-user-btn {
  color: var(--text-secondary);
}

/* Inline new-user form */
.new-user-form {
  padding: 4px 6px 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.new-user-input {
  width: 100%;
  padding: 7px 10px;
  font-size: clamp(12px, 1.8vw, 14px);
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 160ms, box-shadow 160ms;
}

.new-user-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
}

.new-user-input::placeholder { color: var(--text-tertiary); }

.new-user-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.new-user-cancel,
.new-user-confirm {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: clamp(11px, 1.6vw, 13px);
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: opacity 140ms;
}

.new-user-cancel:hover,
.new-user-confirm:hover:not(:disabled) { opacity: 0.82; }
.new-user-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

.new-user-cancel {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.new-user-confirm {
  background: var(--accent-primary);
  color: #fff;
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
