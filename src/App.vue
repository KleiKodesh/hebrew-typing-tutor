<template>
  <div class="app">
    <!-- Step 1 (2+ users): pick an existing user or start new -->
    <UserPicker
      v-if="screen === 'picker'"
      @select="onPickUser"
      @new="onPickNew"
    />

    <!-- Step 2 (new user): enter name -->
    <UserNameSetup
      v-else-if="screen === 'name'"
      @done="onNameDone"
    />

    <!-- Step 3 (new user): intro slides -->
    <IntroSlides
      v-else-if="screen === 'intro'"
      @done="onIntroDone"
      @skip="onIntroDone"
    />

    <!-- Main app -->
    <template v-else>
      <div v-if="debugEnabled" class="mode-toggle">
        <button
          v-if="showSimulator"
          type="button"
          :title="t('← חזרה למאמן')"
          :aria-label="t('← חזרה למאמן')"
          @click="showSimulator = false"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 5l-7 7 7 7M7 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          v-else
          type="button"
          :title="t('סימולטור ידיים: מצב ניפוי שגיאות →')"
          :aria-label="t('סימולטור ידיים: מצב ניפוי שגיאות →')"
          @click="showSimulator = true"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 11V5.5a1.5 1.5 0 013 0V10 4.5a1.5 1.5 0 013 0V10 6a1.5 1.5 0 013 0v6.5l1.2-1.6a1.7 1.7 0 012.8 1.9l-3.5 5.1a4 4 0 01-3.3 1.7h-3.1a4 4 0 01-3.4-1.9L5 13.8a1.7 1.7 0 012.7-2L10 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <TypingPage v-if="!showSimulator" @show-intro="onShowIntroFromApp" @new-user="onPickNew" @reset-to-intro="onResetToIntro" />
      <SimulatorPage v-else-if="debugEnabled" />
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TypingPage from './TypingTutor/TypingPage.vue'
import SimulatorPage from './TypingTutor/SimulatorPage.vue'
import IntroSlides from './Onboarding/IntroSlides.vue'
import UserNameSetup from './Onboarding/UserNameSetup.vue'
import UserPicker from './Onboarding/UserPicker.vue'
import { DEBUG_CONFIG } from './Debug/config'
import { useUserProfile } from './composables/useUserProfile'
import { useDarkMode } from './composables/useDarkMode'
import { useUiLanguage } from './composables/useUiLanguage'

// Initialize dark mode immediately so theme is applied to all screens
useDarkMode()
const { language, t } = useUiLanguage()

watch(language, (value) => {
  document.title = value === 'he' ? 'הקלדה עברית' : 'Hebrew Typing Tutor'
}, { immediate: true })

const showSimulator = ref(false)
const debugEnabled = DEBUG_CONFIG.ENABLE_HAND_SIMULATOR

const { allUsers, userName, switchUser, setUserName, markIntroSeen } = useUserProfile()

// ── Determine initial screen ────────────────────────────────────────────────
type Screen = 'picker' | 'name' | 'intro' | 'app'

function initialScreen(): Screen {
  if (allUsers.value.length === 0) return 'name'       // no users yet → ask for name
  if (allUsers.value.length === 1) {                   // exactly one user → auto-login
    switchUser(allUsers.value[0])
    return 'app'
  }

  return 'picker'                                       // multiple users → let them choose
}

const screen = ref<Screen>(initialScreen())

// ── Handlers ────────────────────────────────────────────────────────────────

// User picked an existing user from the picker
function onPickUser(name: string) {
  switchUser(name)
  screen.value = 'app'
}

// User chose "new user" from the picker
function onPickNew() {
  screen.value = 'name'
}

// Name entered → show intro for new users
function onNameDone(name: string) {
  setUserName(name)
  screen.value = 'intro'
}

// Intro finished
function onIntroDone() {
  markIntroSeen()
  screen.value = 'app'
}

// User button clicked inside the app → go to picker or name entry
function onShowIntroFromApp() {
  if (allUsers.value.length > 1) {
    screen.value = 'picker'
  } else if (allUsers.value.length === 1) {
    // Only one user left, auto-login
    switchUser(allUsers.value[0])
    screen.value = 'app'
  } else {
    // No users left, go to name entry
    screen.value = 'name'
  }
}

// Reset button clicked → show intro slides again
function onResetToIntro() {
  screen.value = 'intro'
}
</script>

<style>
.app {
  width: 100%;
  height: 100%;
}

.mode-toggle {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 1000;
}

.mode-toggle button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--border-subtle);
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--text-secondary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: color 150ms, border-color 150ms, transform 150ms;
}

.mode-toggle button:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.mode-toggle svg {
  width: 18px;
  height: 18px;
}

</style>
