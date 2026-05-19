import { ref, computed, onUnmounted } from 'vue'
import type { Ref } from 'vue'

const SESSION_MAX_MS = 20 * 60 * 1000
const SESSION_WARN_MS = 18 * 60 * 1000

export function useSessionTimer(userKey: (key: string) => string) {
  function todayKey(): string {
    const d = new Date()
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return userKey(`sessionTime_${dateStr}`)
  }

  function loadTodayMs(): number {
    return parseInt(localStorage.getItem(todayKey()) ?? '0', 10) || 0
  }

  function saveTodayMs(ms: number) {
    localStorage.setItem(todayKey(), String(ms))
  }

  const sessionElapsedMs = ref(loadTodayMs())
  const sessionWarning = ref(sessionElapsedMs.value >= SESSION_WARN_MS)
  const sessionExpired = ref(sessionElapsedMs.value >= SESSION_MAX_MS)

  let intervalId: ReturnType<typeof setInterval> | null = null

  function start() {
    if (sessionExpired.value) return
    if (intervalId) return
    intervalId = setInterval(() => {
      sessionElapsedMs.value += 1000
      saveTodayMs(sessionElapsedMs.value)
      if (sessionElapsedMs.value >= SESSION_MAX_MS) {
        sessionExpired.value = true
        sessionWarning.value = false
        stop()
      } else if (sessionElapsedMs.value >= SESSION_WARN_MS) {
        sessionWarning.value = true
      }
    }, 1000)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    localStorage.removeItem(todayKey())
    sessionElapsedMs.value = 0
    sessionWarning.value = false
    sessionExpired.value = false
  }

  function reloadForUser() {
    stop()
    sessionElapsedMs.value = loadTodayMs()
    sessionWarning.value = sessionElapsedMs.value >= SESSION_WARN_MS
    sessionExpired.value = sessionElapsedMs.value >= SESSION_MAX_MS
  }

  function dismissExpired() {
    sessionExpired.value = false
  }

  function continueAfterExpiration() {
    sessionExpired.value = false
    saveTodayMs(0)
    sessionElapsedMs.value = 0
    sessionWarning.value = false
    start()
  }

  const sessionSecondsDisplay = computed(() => {
    const remaining = Math.max(0, SESSION_MAX_MS - sessionElapsedMs.value)
    const m = Math.floor(remaining / 60000)
    const s = Math.floor((remaining % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  })

  const sessionMinutesLeft = computed(() => {
    const remaining = SESSION_MAX_MS - sessionElapsedMs.value
    return Math.max(0, Math.ceil(remaining / 60000))
  })

  onUnmounted(() => stop())

  return {
    sessionElapsedMs,
    sessionWarning,
    sessionExpired,
    sessionSecondsDisplay,
    sessionMinutesLeft,
    startSessionTimer: start,
    stopSessionTimer: stop,
    resetSession: reset,
    reloadSessionForUser: reloadForUser,
    dismissExpired,
    continueAfterExpiration,
  }
}
