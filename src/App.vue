<template>
  <div class="app">
    <div v-if="debugEnabled && showSimulator" class="mode-toggle">
      <button @click="showSimulator = false">← Back to Tutor</button>
    </div>
    <div v-else-if="debugEnabled" class="mode-toggle">
      <button @click="showSimulator = true">Debug: Hand Simulator →</button>
    </div>

    <TypingPage v-if="!showSimulator" />
    <SimulatorPage v-else-if="debugEnabled" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TypingPage from './TypingTutor/TypingPage.vue'
import SimulatorPage from './TypingTutor/SimulatorPage.vue'
import { DEBUG_CONFIG } from './Debug/config'

const showSimulator = ref(false)
const debugEnabled = DEBUG_CONFIG.ENABLE_HAND_SIMULATOR
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

