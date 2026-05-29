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
      <div v-if="debugEnabled && showSimulator" class="mode-toggle">
        <button @click="showSimulator = false">← Back to Tutor</button>
      </div>
      <div v-else-if="debugEnabled" class="mode-toggle">
        <button @click="showSimulator = true">Debug: Hand Simulator →</button>
      </div>

      <TypingPage v-if="!showSimulator" @show-intro="onShowIntroFromApp" @new-user="onPickNew" @reset-to-intro="onResetToIntro" />
      <SimulatorPage v-else-if="debugEnabled" />
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TypingPage from './TypingTutor/TypingPage.vue'
import SimulatorPage from './TypingTutor/SimulatorPage.vue'
import IntroSlides from './Onboarding/IntroSlides.vue'
import UserNameSetup from './Onboarding/UserNameSetup.vue'
import UserPicker from './Onboarding/UserPicker.vue'
import { DEBUG_CONFIG } from './Debug/config'
import { useUserProfile } from './composables/useUserProfile'
import { useDarkMode } from './composables/useDarkMode'

// Initialize dark mode immediately so theme is applied to all screens
useDarkMode()

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
  top: 8px;
  right: 8px;
  z-index: 1000;
}

.mode-toggle button {
  padding: 6px 12px;
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 150ms;
}

.mode-toggle button:hover {
  opacity: 0.88;
}
</style>

