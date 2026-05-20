import { ref } from 'vue'

const ACTIVE_USER_KEY = 'activeUser'
const ALL_USERS_KEY = 'allUsers'

function introSeenKey(name: string): string {
  return `user:${name}:introSeen`
}

function stageIntroSeenKey(name: string, stageId: string): string {
  return `user:${name}:stageIntroSeen:${stageId}`
}

function lessonCompletedKey(name: string, lessonId: string): string {
  return `user:${name}:lessonCompleted:${lessonId}`
}

function lessonStatsKey(name: string, lessonId: string): string {
  return `user:${name}:lessonStats:${lessonId}`
}

function userDataPrefix(name: string): string {
  return `user:${name}:`
}

function loadAllUsers(): string[] {
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === 'string' && u.trim()) : []
  } catch {
    return []
  }
}

function saveAllUsers(users: string[]) {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users))
}

// Module-level singletons so all composable instances share the same state
const userName = ref<string>(localStorage.getItem(ACTIVE_USER_KEY) ?? '')
const allUsers = ref<string[]>(loadAllUsers())

// introSeen is derived from the active user's own key
const introSeen = ref<boolean>(
  userName.value ? localStorage.getItem(introSeenKey(userName.value)) === 'true' : false
)

// Migrate legacy single-user storage
const legacyName = localStorage.getItem('userName')
if (legacyName && !allUsers.value.includes(legacyName)) {
  allUsers.value.push(legacyName)
  saveAllUsers(allUsers.value)
  if (!userName.value) {
    userName.value = legacyName
    localStorage.setItem(ACTIVE_USER_KEY, legacyName)
  }
  localStorage.removeItem('userName')
}

// Migrate legacy global introSeen to the active user's key
const legacyIntroSeen = localStorage.getItem('introSeen')
if (legacyIntroSeen !== null && userName.value) {
  if (!localStorage.getItem(introSeenKey(userName.value))) {
    localStorage.setItem(introSeenKey(userName.value), legacyIntroSeen)
  }
  localStorage.removeItem('introSeen')
}

export type LessonStats = {
  accuracy: number
  wpm: number
  ayinAccuracy: number | null
  timeUsedMs: number
  hasAyinCheck: boolean
}

export function useUserProfile() {
  function addUser(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!allUsers.value.includes(trimmed)) {
      allUsers.value = [...allUsers.value, trimmed]
      saveAllUsers(allUsers.value)
    }
    switchUser(trimmed)
  }

  function switchUser(name: string) {
    userName.value = name
    localStorage.setItem(ACTIVE_USER_KEY, name)
    // Load this user's introSeen flag
    introSeen.value = localStorage.getItem(introSeenKey(name)) === 'true'
  }

  // Keep setUserName as an alias for addUser (used by onboarding flow)
  function setUserName(name: string) {
    addUser(name)
  }

  function markIntroSeen() {
    introSeen.value = true
    if (userName.value) {
      localStorage.setItem(introSeenKey(userName.value), 'true')
    }
  }

  function resetIntro() {
    introSeen.value = false
    if (userName.value) {
      localStorage.removeItem(introSeenKey(userName.value))
    }
  }

  function isStageIntroSeen(stageId: string): boolean {
    if (!userName.value) return false
    return localStorage.getItem(stageIntroSeenKey(userName.value, stageId)) === 'true'
  }

  function markStageIntroSeen(stageId: string) {
    if (userName.value) {
      localStorage.setItem(stageIntroSeenKey(userName.value, stageId), 'true')
    }
  }

  function resetStageIntro(stageId: string) {
    if (userName.value) {
      localStorage.removeItem(stageIntroSeenKey(userName.value, stageId))
    }
  }

  function isLessonCompleted(lessonId: string): boolean {
    if (!userName.value) return false
    return localStorage.getItem(lessonCompletedKey(userName.value, lessonId)) === 'true'
  }

  function markLessonCompleted(lessonId: string, stats?: LessonStats) {
    if (userName.value) {
      localStorage.setItem(lessonCompletedKey(userName.value, lessonId), 'true')
      if (stats) {
        localStorage.setItem(lessonStatsKey(userName.value, lessonId), JSON.stringify(stats))
      }
    }
  }

  function resetLessonCompleted(lessonId: string) {
    if (userName.value) {
      localStorage.removeItem(lessonCompletedKey(userName.value, lessonId))
      localStorage.removeItem(lessonStatsKey(userName.value, lessonId))
    }
  }

  function getLessonStats(lessonId: string): LessonStats | null {
    if (!userName.value) return null
    try {
      const raw = localStorage.getItem(lessonStatsKey(userName.value, lessonId))
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function clearUser() {
    userName.value = ''
    localStorage.removeItem(ACTIVE_USER_KEY)
  }

  function deleteUser(name: string) {
    allUsers.value = allUsers.value.filter((u) => u !== name)
    saveAllUsers(allUsers.value)

    // Wipe all per-user localStorage keys
    const prefix = userDataPrefix(name)
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) keysToRemove.push(key)
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))

    // If we deleted the active user, clear it
    if (userName.value === name) {
      clearUser()
    }
  }

  return {
    userName,
    allUsers,
    introSeen,
    addUser,
    switchUser,
    setUserName,
    markIntroSeen,
    resetIntro,
    clearUser,
    deleteUser,
    isStageIntroSeen,
    markStageIntroSeen,
    resetStageIntro,
    isLessonCompleted,
    markLessonCompleted,
    resetLessonCompleted,
    getLessonStats,
  }
}
