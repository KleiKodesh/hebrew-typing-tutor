<template>
  <div class="samples">
    <div class="text" v-html="displayText"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ displayText: string }>()
</script>

<style scoped>
.samples{margin-bottom:6px}
.text{background:white;padding:10px;border-radius:12px;overflow:auto;font-size:clamp(15px,2.2vw,18px);line-height:1.7;white-space:pre-wrap;text-align:right;box-shadow:0 4px 12px rgba(16,24,40,0.06);border:1px solid rgba(16,24,40,0.04);min-height:0}
.text span.current {
  background: rgba(59,130,246,0.25);
  color: #0f172a;
  border-radius: 5px;
  padding: 0.2em 0.3em;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(59,130,246,0.3);
}
.text span.correct {
  color: #0f766e;
}
.text span.wrong {
  color: #b91c1c;
  text-decoration: underline wavy rgba(185,28,28,0.7);
}
</style>
