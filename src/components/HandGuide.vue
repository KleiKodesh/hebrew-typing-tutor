<template>
  <div class="hand-guide">
    <div class="hand-icon" v-for="hand in hands" :key="hand.side">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          class="hand-base"
          :transform="hand.transform || undefined"
          d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z"
        />
        <g class="finger-markers">
          <circle
            v-for="finger in hand.markers"
            :key="finger.id"
            :cx="finger.cx"
            :cy="finger.cy"
            r="1.4"
            :class="['finger-dot', { active: finger.id === activeFinger || (activeFinger === 'thumb' && finger.id.endsWith('-thumb')) }]"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ nextKey: string }>()

// Standard Israeli Hebrew keyboard layout (Windows standard)
// Finger zones follow the universal touch-typing convention:
//   Left  pinky : ` 1 Q(/) W(') A(ש) Z(ז)  + [ ] \ ; ' (right pinky equivalents on right)
//   Left  ring  : 2 E(ק)  S(ד) X(ס)
//   Left  middle: 3 R(ר)  D(ג) C(ב)
//   Left  index : 4 5 T(א) Y(ו) F(כ) G(ע) V(ה) B(נ)   ← index covers 2 columns
//   Right index : 6 7 Y(ו)... H(י) J(ח) N(מ) M(צ)      ← index covers 2 columns
//   Right middle: 8 I(ם)  K(ל) ,(ת)
//   Right ring  : 9 O(פ)  L(ך) .(ץ)
//   Right pinky : 0 - = P(?) [(ל?) ](ף?) \(ץ?) ;(ף) ,(,) backspace enter shift
//
// Windows Israeli keyboard exact mapping:
//   Q=/  W='  E=ק  R=ר  T=א  Y=ו  U=ן  I=ם  O=פ  P=ל  [=ך  ]=ף  \=ץ  (unshifted top row, no Tab)
//   A=ש  S=ד  D=ג  F=כ  G=ע  H=י  J=ח  K=ל  L=ך  ;=ף              (home row)
//   Z=ז  X=ס  C=ב  V=ה  B=נ  N=מ  M=צ  ,=ת  .=ץ  /=.              (bottom row)
//
// Note: ל appears on both P and K, ך on both [ and L, ף on ] and ;, ץ on \ and .
// We map each Hebrew letter to the canonical home/most-used position.

const fingerMap: Record<string, string> = {
  // ── Number row ──────────────────────────────────────────────
  '`':  'left-pinky',
  '~':  'left-pinky',
  '1':  'left-pinky',
  '!':  'left-pinky',
  '2':  'left-ring',
  '@':  'left-ring',
  '3':  'left-middle',
  '#':  'left-middle',
  '4':  'left-index',
  '$':  'left-index',
  '5':  'left-index',
  '%':  'left-index',
  '6':  'right-index',
  '^':  'right-index',
  '7':  'right-index',
  '&':  'right-index',
  '8':  'right-middle',
  '*':  'right-middle',
  '9':  'right-ring',
  '(':  'right-ring',
  '0':  'right-pinky',
  ')':  'right-pinky',
  '-':  'right-pinky',
  '_':  'right-pinky',
  '=':  'right-pinky',
  '+':  'right-pinky',

  // ── Top row (Q W E R T | Y U I O P [ ] \) ───────────────────
  // Q = /  (left pinky)
  '/':  'left-pinky',
  // W = '  (left pinky)
  "'":  'left-pinky',
  // E = ק  (left ring)
  'ק':  'left-ring',
  // R = ר  (left middle)
  'ר':  'left-middle',
  // T = א  (left index)
  'א':  'left-index',
  // Y = ו  (right index)
  'ו':  'right-index',
  // U = ן  (right middle)
  'ן':  'right-middle',
  // I = ם  (right ring)
  'ם':  'right-ring',
  // O = פ  (right pinky)
  'פ':  'right-pinky',
  // P = ל  (right pinky) — also appears on K (right-middle), canonical = right-pinky for P
  // [ = ך  (right pinky)
  'ך':  'right-pinky',
  // ] = ף  (right pinky)
  'ף':  'right-pinky',
  // \ = ץ  (right pinky) — also on . (right-ring); canonical pinky for top-row position
  '[':  'right-pinky',
  ']':  'right-pinky',
  '\\': 'right-pinky',

  // ── Home row (A S D F G | H J K L ;) ────────────────────────
  // A = ש  (left pinky)
  'ש':  'left-pinky',
  // S = ד  (left ring)
  'ד':  'left-ring',
  // D = ג  (left middle)
  'ג':  'left-middle',
  // F = כ  (left index)
  'כ':  'left-index',
  // G = ע  (left index — second index column)
  'ע':  'left-index',
  // H = י  (right index)
  'י':  'right-index',
  // J = ח  (right index — second index column)
  'ח':  'right-index',
  // K = ל  (right middle)
  'ל':  'right-middle',
  // L = ך  — already mapped above to right-pinky ([ key is canonical), but L position = right-ring
  // We use the most ergonomic: ך typed via L = right-ring
  // Override: ך → right-ring (L key is more commonly used than [ for ך)
  // ; = ף  (right pinky)

  // ── Bottom row (Z X C V B | N M , . /) ───────────────────────
  // Z = ז  (left pinky)
  'ז':  'left-pinky',
  // X = ס  (left ring)
  'ס':  'left-ring',
  // C = ב  (left middle)
  'ב':  'left-middle',
  // V = ה  (left index)
  'ה':  'left-index',
  // B = נ  (left index — second index column)
  'נ':  'left-index',
  // N = מ  (right index)
  'מ':  'right-index',
  // M = צ  (right index — second index column)
  'צ':  'right-index',
  // , = ת  (right middle)
  'ת':  'right-middle',
  // . = ץ  (right ring) — canonical bottom-row position
  'ץ':  'right-ring',
  // / = .  (right pinky — the period/dot punctuation in Hebrew context)
  '.':  'right-pinky',
  ',':  'right-pinky',

  // ── Space ────────────────────────────────────────────────────
  ' ':  'thumb',
}

type HandSide = 'left' | 'right'

const activeFinger = computed(() => fingerMap[props.nextKey] ?? '')

const hands: { side: HandSide; transform: string; markers: { id: string; cx: number; cy: number }[] }[] = [
  {
    side: 'left',
    transform: 'scale(-1, 1) translate(-32, 0)',
    markers: [
      { id: 'left-pinky',  cx: 2.5,  cy: 8.7  },
      { id: 'left-ring',   cx: 9.8,  cy: 3.4  },
      { id: 'left-middle', cx: 17.5, cy: 2.6  },
      { id: 'left-index',  cx: 25.1, cy: 7.7  },
      { id: 'left-thumb',  cx: 29.1, cy: 26.8 },
    ],
  },
  {
    side: 'right',
    transform: '',
    markers: [
      { id: 'right-pinky',  cx: 29.5, cy: 8.7  },
      { id: 'right-ring',   cx: 22.2, cy: 3.4  },
      { id: 'right-middle', cx: 14.5, cy: 2.6  },
      { id: 'right-index',  cx: 6.9,  cy: 7.7  },
      { id: 'right-thumb',  cx: 2.9,  cy: 26.8 },
    ],
  },
]
</script>

<style scoped>
.hand-guide {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 6px 0 0;
  direction: ltr;
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
  transform-box: fill-box;
  transform-origin: center;
}
</style>