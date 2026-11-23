<template>
  <div class="lesson-info">
    <div class="lesson-content">
      <h2 v-if="title" class="lesson-title" :key="`title-${lessonId}`">{{ title }}</h2>
      <div class="lesson-text" :key="`text-${lessonId}`">
        <p v-for="(sentence, i) in sentences" :key="i" :class="{ lead: i === 0 }">
          <template v-for="(part, j) in sentence" :key="j">
            <kbd v-if="part.key" class="keycap">{{ part.text }}</kbd>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
      </div>
    </div>
    <div v-if="guidance" class="guidance-hint">
      <svg class="guidance-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3" />
        <path d="M8 4.5V8l2.3 1.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      </svg>
      <span>{{ guidance }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lessonId?: string
  title?: string
  text: string
  guidance?: string
}>()

type Part = { text: string; key: boolean }

/** A lone Hebrew letter in the instructions names a key, so it is shown as a keycap
 *  (a letter touching a quote mark is part of an abbreviation, not a key). */
const LONE_LETTER = /(?<![\u0590-\u05FF'"\u05F3\u05F4])([\u05D0-\u05EA])(?![\u0590-\u05FF'"\u05F3\u05F4])/g

function splitKeys(sentence: string): Part[] {
  const parts: Part[] = []
  let last = 0
  for (const m of sentence.matchAll(LONE_LETTER)) {
    if (m.index! > last) parts.push({ text: sentence.slice(last, m.index), key: false })
    parts.push({ text: m[1], key: true })
    last = m.index! + 1
  }
  if (last < sentence.length) parts.push({ text: sentence.slice(last), key: false })
  return parts
}

/** One paragraph per sentence: the first reads as the lead, the rest as detail. */
const sentences = computed(() =>
  (props.text.match(/[^.!?]+[.!?]*\s*/g) ?? [props.text])
    .map(s => s.trim())
    .filter(Boolean)
    .map(splitKeys))
</script>

<style scoped>
.lesson-info {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: clamp(6px, 1.1vw, 10px) clamp(8px, 1.5vw, 12px);
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.7vw, 6px);
  overflow: hidden;
  min-height: 0;
}

.lesson-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.8vw, 7px);
  overflow-y: auto;
  min-height: 0;
}

.lesson-title {
  font-size: clamp(14px, 1.8vw, 17px);
  font-weight: 600;
  color: var(--text-primary);
  flex-shrink: 0;
  line-height: 1.3;
}

.lesson-title { margin: 0; }

.lesson-text {
  font-size: clamp(11px, 1.4vw, 13px);
  color: var(--text-tertiary);
  line-height: 1.6;
}

.lesson-text p { margin: 0 0 2px; }

.lesson-text p.lead {
  font-size: clamp(12px, 1.6vw, 14px);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.keycap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  height: 1.6em;
  padding: 0 4px;
  margin: 0 2px;
  border: 1px solid var(--border-color);
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--bg-primary);
  color: var(--accent-primary);
  font: inherit;
  font-weight: 600;
  line-height: 1;
  vertical-align: 0.05em;
}

.guidance-hint {
  font-size: clamp(10px, 1.3vw, 12px);
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
  padding: clamp(4px, 0.7vw, 7px) clamp(8px, 1.2vw, 12px);
  border-radius: 6px;
  border-right: 3px solid var(--accent-primary);
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  transition: background 200ms ease;
}

.guidance-icon { width: 14px; height: 14px; flex-shrink: 0; margin-top: 2px; color: var(--accent-primary); }

.guidance-hint:hover { background: color-mix(in srgb, var(--accent-primary) 12%, transparent); }
</style>
