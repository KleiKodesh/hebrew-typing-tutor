import { ref, watch } from 'vue'

export type LessonCompletion = {
  id: string
  zones: number[]
}

export type CompletionData = {
  completed: boolean
  lessons: LessonCompletion[]
}

export type UserData = {
  position: { stageIndex: number; lessonId: string; zoneIndex: number }
  weak: Record<string, number>
}

export type UserCompletions = Record<string, CompletionData>

export function usePersistence() {
  // ── Key helpers ─────────────────────────────────────────────────────────────
  function userPositionKey(userName: string): string {
    return `user:${userName}:position`
  }

  function userCompletionKey(userName: string, stageId: string): string {
    return `user:${userName}:completions:${stageId}`
  }

  function userWeakKey(userName: string): string {
    return `user:${userName}:weak`
  }

  function userDataKey(userName: string): string {
    return `user:${userName}:data`
  }

  // ── Position persistence ────────────────────────────────────────────────────
  function savePosition(
    userName: string,
    position: { stageIndex: number; lessonId: string; zoneIndex: number }
  ) {
    localStorage.setItem(userPositionKey(userName), JSON.stringify(position))
  }

  function loadPosition(userName: string) {
    const key = userPositionKey(userName)
    const saved = localStorage.getItem(key)
    if (!saved) return { stageIndex: 0, lessonId: '', zoneIndex: 0 }
    try {
      return JSON.parse(saved)
    } catch {
      return { stageIndex: 0, lessonId: '', zoneIndex: 0 }
    }
  }

  // ── Stage completion persistence (each stage separate) ──────────────────────
  function saveStageCompletion(
    userName: string,
    stageId: string,
    completion: CompletionData
  ) {
    localStorage.setItem(userCompletionKey(userName, stageId), JSON.stringify(completion))
  }

  function loadStageCompletion(userName: string, stageId: string): CompletionData {
    const key = userCompletionKey(userName, stageId)
    const saved = localStorage.getItem(key)
    if (!saved) return { completed: false, lessons: [], zones: {} }
    try {
      return JSON.parse(saved)
    } catch {
      return { completed: false, lessons: [], zones: {} }
    }
  }

  function deleteStageCompletion(userName: string, stageId: string) {
    localStorage.removeItem(userCompletionKey(userName, stageId))
  }

  // ── Weak letters persistence ────────────────────────────────────────────────
  function saveWeak(userName: string, weak: Record<string, number>) {
    localStorage.setItem(userWeakKey(userName), JSON.stringify(weak))
  }

  function loadWeak(userName: string): Record<string, number> {
    const key = userWeakKey(userName)
    const saved = localStorage.getItem(key)
    if (!saved) return {}
    try {
      return JSON.parse(saved)
    } catch {
      return {}
    }
  }

  // ── User management ─────────────────────────────────────────────────────────
  function getAllUsers(): string[] {
    try {
      const raw = localStorage.getItem('allUsers')
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((u) => typeof u === 'string' && u.trim()) : []
    } catch {
      return []
    }
  }

  function saveAllUsers(users: string[]) {
    localStorage.setItem('allUsers', JSON.stringify(users))
  }

  function addUser(userName: string) {
    const trimmed = userName.trim()
    if (!trimmed) return
    const users = getAllUsers()
    if (!users.includes(trimmed)) {
      users.push(trimmed)
      saveAllUsers(users)
    }
  }

  function deleteUser(userName: string) {
    const users = getAllUsers()
    const filtered = users.filter((u) => u !== userName)
    saveAllUsers(filtered)

    // Delete all user data
    const allKeys = Object.keys(localStorage)
    const userPrefix = `user:${userName}:`
    allKeys.forEach((key) => {
      if (key.startsWith(userPrefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  function getActiveUser(): string {
    return localStorage.getItem('activeUser') ?? ''
  }

  function setActiveUser(userName: string) {
    localStorage.setItem('activeUser', userName)
  }

  // ── Reset user data ─────────────────────────────────────────────────────────
  function resetUserData(userName: string) {
    // Keep position at stage 0 but reset everything else
    savePosition(userName, { stageIndex: 0, lessonId: '', zoneIndex: 0 })

    // Delete all stage completions
    const allKeys = Object.keys(localStorage)
    const completionPrefix = `user:${userName}:completions:`
    allKeys.forEach((key) => {
      if (key.startsWith(completionPrefix)) {
        localStorage.removeItem(key)
      }
    })

    // Reset weak letters
    saveWeak(userName, {})
  }

  // ── Clear all data (for development/testing) ────────────────────────────────
  function clearAllData() {
    localStorage.clear()
  }

  // ── Reactive watchers for auto-save ─────────────────────────────────────────
  // These are meant to be called from the typing composable

  function watchPosition(userName: string, positionRef: any) {
    watch(
      () => positionRef.value,
      (newPosition) => {
        savePosition(userName, newPosition)
      },
      { deep: true }
    )
  }

  function watchStageCompletion(
    userName: string,
    stageId: string,
    completionRef: any
  ) {
    watch(
      () => completionRef.value,
      (newCompletion) => {
        saveStageCompletion(userName, stageId, newCompletion)
      },
      { deep: true }
    )
  }

  function watchWeak(userName: string, weakRef: any) {
    watch(
      () => weakRef.value,
      (newWeak) => {
        saveWeak(userName, newWeak)
      },
      { deep: true }
    )
  }

  return {
    // Position
    savePosition,
    loadPosition,

    // Stage completions (each stage separate)
    saveStageCompletion,
    loadStageCompletion,
    deleteStageCompletion,

    // Weak letters
    saveWeak,
    loadWeak,

    // User management
    getAllUsers,
    saveAllUsers,
    addUser,
    deleteUser,
    getActiveUser,
    setActiveUser,

    // Reset
    resetUserData,
    clearAllData,

    // Watchers
    watchPosition,
    watchStageCompletion,
    watchWeak,
  }
}
