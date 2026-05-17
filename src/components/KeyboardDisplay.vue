<template>
  <div class="keyboard">
    <div
      class="row"
      v-for="row in keyboard"
      :key="row.join('')"
    >
      <div
        class="key"
        :class="keyClasses(k)"
        :style="keyStyle(k)"
        v-for="k in row"
        :key="k"
      >
        {{ displayKey(k) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  keyboard: string[][]
  heldKey: string
  nextKey: string
  mistakeKey: string
}>()

const wideKeys = new Set(['Backspace', 'Tab', 'Caps', 'Enter', 'Shift', 'Ctrl', 'Win', 'Alt', 'Fn', 'Space'])

function normalizeKey(key: string) {
  if (key === ' ') {
    return 'Space'
  }
  return key
}

function keyMatches(key: string, value: string) {
  return normalizeKey(value) === normalizeKey(key)
}

function keyClasses(key: string) {
  return {
    held: keyMatches(key, props.heldKey),
    next: keyMatches(key, props.nextKey),
    mistake: keyMatches(key, props.mistakeKey),
    special: wideKeys.has(key) || key.length > 1
  }
}

const keyUnits: Record<string, number> = {
  ESC: 1.0,
  Backspace: 1.5,
  Tab: 1.2,
  Caps: 1.2,
  Enter: 2.0,
  Shift: 2.0,
  Ctrl: 1.0,
  Win: 1.0,
  Alt: 1.0,
  Fn: 0.9,
  Space: 3.8
}

function displayKey(key: string) {
  if (key === 'Backspace') {
    return '?'
  }
  if (key === 'Win') {
    return '?'
  }
  return key
}

function keyStyle(key: string) {
  const base = 16
  const units = keyUnits[key] ?? 1
  const width = `${Math.round(base * units)}px`
  return { flex: `${units} 1 0`, minWidth: width }
}
</script>

<style scoped>
.keyboard {
  margin-top: 4px;
  background: #0c0d0f;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #24272d;
  direction: ltr;
  width: 100%;
  box-sizing: border-box;
}
.row {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  gap: 1px;
  margin-bottom: 2px;
  flex-wrap: nowrap;
  overflow-x: hidden;
  padding: 0;
}
.row:last-child {
  margin-bottom: 0;
}
.row::-webkit-scrollbar {
  height: 3px;
}
.key {
  position: relative;
  flex: 0 0 auto;
  min-width: 18px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #18191b;
  border: 1px solid #2f3338;
  font-size: 9px;
  font-weight: 600;
  color: #e5e7eb;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.05);
  padding: 0 3px;
  white-space: nowrap;
}
.key.special {
  border-radius: 6px;
  background: #1c1f24;
  font-size: 10px;
}
.key.held {
  background: #0f5fe2;
  color: #ffffff;
  border-color: rgba(15,95,226,0.5);
}
.key.next {
  background: #f8df97;
  color: #1f2937;
  border-color: #f59e0b;
}
.key.mistake {
  background: #fee2e2;
  color: #991b1b;
  border-color: #ef4444;
}
</style>
