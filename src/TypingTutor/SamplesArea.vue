<template>
  <div class="samples">
    <div class="text" v-html="displayText"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ displayText: string }>()
</script>

<style scoped>
.samples {
  margin-bottom: 10px;
}

.text {
  background: rgba(243, 243, 247, 0.56);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 16px 18px;
  border-radius: 18px;
  overflow: auto;
  font-size: clamp(15px, 2.2vw, 18px);
  line-height: 1.75;
  white-space: pre-wrap;
  text-align: right;
  box-shadow: inset 0 0 0 1px rgba(16, 20, 24, 0.04);
  border: 1px solid rgba(16, 20, 24, 0.06);
  min-height: 0;
}

.text span.current {
  background: rgba(0, 120, 212, 0.18);
  color: var(--text-primary);
  border-radius: 10px;
  padding: 0.24em 0.36em;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px rgba(0, 120, 212, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, opacity 180ms ease, background 180ms ease, color 180ms ease;
  animation: fluentReveal 220ms ease both;
}

.text span.correct {
  color: var(--success-color);
  background: rgba(16, 124, 16, 0.08);
  border-radius: 8px;
  padding: 0.12em 0.24em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, opacity 180ms ease, background 180ms ease, color 180ms ease;
  animation: fluentReveal 220ms ease both;
}

.text span.wrong {
  color: var(--error-color);
  background: rgba(232, 27, 35, 0.08);
  border-radius: 8px;
  padding: 0.12em 0.24em;
  text-decoration: underline wavy rgba(232, 27, 35, 0.28);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, opacity 180ms ease, background 180ms ease, color 180ms ease;
  animation: fluentReveal 220ms ease both;
}

@keyframes fluentReveal {
  from {
    transform: translateY(4px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
