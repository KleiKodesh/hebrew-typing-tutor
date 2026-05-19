import { ref, watch } from 'vue'

// Detect system preference - default to system, can be overridden by localStorage
function getInitialTheme(): boolean {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    return saved === 'true'
  }
  // Use system preference if no saved preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDarkMode = ref<boolean>(getInitialTheme())

// Listen for system theme changes — registered once at module level (singleton)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
function handleSystemThemeChange(e: MediaQueryListEvent) {
  const saved = localStorage.getItem('darkMode')
  if (saved === null) {
    // Only follow system preference if user hasn't manually set a preference
    isDarkMode.value = e.matches
  }
}
mediaQuery.addEventListener('change', handleSystemThemeChange)

export function useDarkMode() {
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('darkMode', String(newValue))
    document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
  }, { immediate: true })

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    isDarkMode,
    toggleDarkMode,
  }
}
