<template>
  <div class="samples">
    <div class="tunnel" ref="tunnelEl" v-html="displayText"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{ displayText: string }>()

const tunnelEl = ref<HTMLElement | null>(null)

// Anchor: keep the current-char marker this far from the right edge (RTL scroll)
const ANCHOR_RATIO = 0.35

watch(
  () => props.displayText,
  async () => {
    await nextTick()
    const el = tunnelEl.value
    if (!el) return
    const current = el.querySelector<HTMLElement>('span.current')
    if (!current) {
      el.scrollLeft = 0
      return
    }

    // getBoundingClientRect is fine here because we're SETTING scrollLeft, not
    // reading it back into a computed value — no feedback loop possible.
    const tunnelRect = el.getBoundingClientRect()
    const spanRect   = current.getBoundingClientRect()

    // In RTL, scrollLeft = 0 means scrolled to the right end (start of text).
    // Positive scrollLeft scrolls toward the left (toward end of text).
    // We want the span centre to sit at ANCHOR_RATIO from the right edge.
    const anchorX = tunnelRect.right - tunnelRect.width * ANCHOR_RATIO
    const spanCentreX = spanRect.left + spanRect.width / 2

    // How far we need to shift the viewport leftward
    el.scrollLeft += spanCentreX - anchorX
  },
  { immediate: true }
)
</script>

<style scoped>
.samples {
  margin-bottom: 10px;
}

.tunnel {
  background: rgba(243, 243, 247, 0.56);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 16px 18px;
  border-radius: 18px;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  font-size: clamp(15px, 2.2vw, 18px);
  line-height: 1.75;
  white-space: nowrap;
  text-align: right;
  box-shadow: inset 0 0 0 1px rgba(16, 20, 24, 0.04);
  border: 1px solid rgba(16, 20, 24, 0.06);
  direction: rtl;
  scrollbar-width: none;
}

.tunnel::-webkit-scrollbar { display: none; }

:deep(span.current) {
  background: rgba(0, 120, 212, 0.18);
  color: var(--text-primary);
  border-radius: 10px;
  padding: 0.24em 0.36em;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px rgba(0, 120, 212, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, opacity 180ms ease;
  animation: fluentReveal 220ms ease both;
}

:deep(span.correct) {
  color: var(--success-color);
  background: rgba(16, 124, 16, 0.08);
  border-radius: 8px;
  padding: 0.12em 0.24em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, opacity 180ms ease;
  animation: fluentReveal 220ms ease both;
}

:deep(span.wrong) {
  color: var(--error-color);
  background: rgba(232, 27, 35, 0.08);
  border-radius: 8px;
  padding: 0.12em 0.24em;
  text-decoration: underline wavy rgba(232, 27, 35, 0.28);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, opacity 180ms ease;
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
