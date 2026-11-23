import { ref, watch } from 'vue'

const STORAGE_KEY = 'showKeyboard'

function loadVisible(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

/** Whether the on-screen keyboard is shown; one shared value, remembered between visits. */
const isKeyboardVisible = ref<boolean>(loadVisible())

watch(isKeyboardVisible, (visible) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(visible))
  } catch { /* storage blocked: the choice lasts for this visit only */ }
})

export function useKeyboardVisible() {
  function toggleKeyboard() {
    isKeyboardVisible.value = !isKeyboardVisible.value
  }
  return { isKeyboardVisible, toggleKeyboard }
}
