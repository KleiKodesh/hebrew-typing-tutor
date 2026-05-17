<template>
  <div class="samples">
    <div class="text" v-html="displayText"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ displayText: string }>()
</script>

<style scoped>
.samples{margin-bottom:10px}
.text{
  background: var(--bg-secondary);
  padding:12px 14px;
  border-radius:14px;
  overflow:auto;
  font-size:clamp(15px,2.2vw,18px);
  line-height:1.7;
  white-space:pre-wrap;
  text-align:right;
  box-shadow:0 12px 30px rgba(16,24,40,0.06);
  border:1px solid var(--border-subtle);
  min-height:0;
}
.text span.current {
  background: rgba(0,120,212,0.12);
  color: #071233;
  border-radius:6px;
  padding: 0.24em 0.36em;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(0,120,212,0.12);
}
.text span.correct { color: var(--success-color) }
.text span.wrong { color: var(--error-color); text-decoration: underline wavy rgba(232,27,35,0.18) }
</style>
