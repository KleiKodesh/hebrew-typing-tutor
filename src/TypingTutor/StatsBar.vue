<template>
  <div class="stats-bar">
      <div class="stat">
      <span class="label">מהירות</span>
      <span class="value">{{ wpm }}</span>
    </div>
    <div class="stat">
      <span class="label">התקדמות</span>
      <span class="value">{{ progress }}%</span>
    </div>
    <div class="stat">
      <span class="label">התקדמות</span>
      <span class="value">{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  wpm: number
  progress: number
}>()
</script>

<style scoped>
.stats-bar {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.55));
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.06);
  border: 1px solid var(--border-subtle);
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.stat { text-align: center; flex: 1 }
.label {
  display: block;
  font-size: 12px;
  color: var(--text-tertiary);
}
.value {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
}
@media (max-width: 520px) {
  .stats-bar { gap: 8px; padding: 8px }
  .stat { min-width: 64px }
}
</style>
