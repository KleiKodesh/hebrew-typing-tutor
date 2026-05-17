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
  gap: 10px;
  padding: 6px 10px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(16,24,40,0.05);
  border: 1px solid rgba(16,24,40,0.04);
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.stat { text-align: center; flex: 1 }
.label {
  display: block;
  font-size: 12px;
  color: #6b7280;
}
.value {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}
@media (max-width: 520px) {
  .stats-bar { gap: 8px; padding: 8px }
  .stat { min-width: 64px }
}
</style>
