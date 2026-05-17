<template>
  <div class="hand-guide">
    <div class="hand-icon">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          class="hand-base"
          d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
        />
        <g class="finger-markers">
          <circle
            v-for="finger in leftFingerMarkers"
            :key="finger.id"
            :cx="finger.cx"
            :cy="finger.cy"
            r="1.4"
            :class="['finger-dot', { active: finger.id === activeFinger }]"
          />
        </g>
      </svg>
    </div>

    <div class="hand-icon">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g transform="scale(-1, 1) translate(-32, 0)">
          <path
            class="hand-base"
            d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
          />
        </g>
        <g class="finger-markers">
          <circle
            v-for="finger in rightFingerMarkers"
            :key="finger.id"
            :cx="finger.cx"
            :cy="finger.cy"
            r="1.4"
            :class="['finger-dot', { active: finger.id === activeFinger }]"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ nextKey: string }>()

const fingerMap: Record<string, string> = {
  'ק': 'left-pinky',
  'ש': 'left-pinky',
  'ז': 'left-pinky',
  'ר': 'left-ring',
  'ד': 'left-ring',
  'ס': 'left-ring',
  'א': 'left-middle',
  'ג': 'left-middle',
  'ב': 'left-middle',
  'ט': 'left-index',
  'כ': 'left-index',
  'ה': 'left-index',
  'ו': 'right-index',
  'ע': 'right-index',
  'נ': 'right-index',
  'ן': 'right-middle',
  'י': 'right-middle',
  'מ': 'right-middle',
  'ם': 'right-ring',
  'ח': 'right-ring',
  'צ': 'right-ring',
  'פ': 'right-pinky',
  'ל': 'right-pinky',
  'ת': 'right-pinky',
  'ך': 'right-pinky',
  'ף': 'right-pinky',
  'ץ': 'right-pinky',
  ',': 'right-pinky',
  '.': 'right-pinky',
  ' ': 'right-thumb',
}

const activeFinger = computed(() => fingerMap[props.nextKey] || '')

const leftFingerMarkers = [
  { id: 'left-pinky',  cx: 29.5, cy: 8.7  },
  { id: 'left-ring',   cx: 22.2, cy: 3.4  },
  { id: 'left-middle', cx: 14.5, cy: 2.6  },
  { id: 'left-index',  cx: 6.9,  cy: 7.7  },
  { id: 'left-thumb',  cx: 2.9,  cy: 26.8 },
]

const rightFingerMarkers = [
  { id: 'right-index',  cx: 25.1, cy: 7.7  },
  { id: 'right-middle', cx: 17.5, cy: 2.6  },
  { id: 'right-ring',   cx: 9.8,  cy: 3.4  },
  { id: 'right-pinky',  cx: 2.5,  cy: 8.7  },
  { id: 'right-thumb',  cx: 29.1, cy: 26.8 },
]
</script>

<style scoped>
.hand-guide {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 6px 0 0;
}
.hand-icon {
  width: 56px;
  min-width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hand-icon svg {
  width: 100%;
  height: auto;
}
.hand-base {
  fill: #334155;
  opacity: 0.18;
}
.finger-dot {
  fill: #cbd5e1;
  stroke: #ffffff;
  stroke-width: 0.4;
  opacity: 0.8;
  transition: transform 180ms ease, fill 180ms ease, opacity 180ms ease;
}
.finger-dot.active {
  fill: #f59e0b;
  opacity: 1;
  transform: scale(1.4);
}
</style>