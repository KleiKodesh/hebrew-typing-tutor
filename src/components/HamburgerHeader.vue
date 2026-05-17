<template>
  <div class="lesson-header">
    <button class="menu-button" @click="$emit('toggle')" aria-label="פתח תפריט">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="lesson-title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<style scoped>
.lesson-header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:6px 0}
.menu-button{width:44px;height:44px;display:flex;flex-direction:column;justify-content:space-around;align-items:center;padding:6px;border:none;border-radius:10px;background:linear-gradient(180deg,#f8fafc,#eef2ff);cursor:pointer;box-shadow:0 2px 8px rgba(16,24,40,0.06)}
.menu-button span{width:14px;height:2px;background:#1f3bb3;border-radius:2px;display:block}
.lesson-title{font-size:16px;font-weight:700;line-height:1;margin-inline-start:8px}
</style>
