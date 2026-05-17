<template>
  <div class="simulator-page">
    <HandSimulator />
  </div>
</template>

<script setup lang="ts">
import HandSimulator from './HandSimulator.vue'
</script>

<style scoped>
.simulator-page {
  width: 100%;
  height: 100dvh;
  overflow: auto;
  background: #f5f5f5;
}
</style>
