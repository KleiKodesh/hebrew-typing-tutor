import { ref, computed } from 'vue'

const ACTIVE_USER_KEY = 'activeUser'
const ALL_USERS_KEY = 'allUsers'
const INTRO_SEEN_KEY = 'introSeen'

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
const introSeen = ref<boolean>(localStorage.getItem(INTRO_SEEN_KEY) === 'true')

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
  }

  // Keep setUserName as an alias for addUser (used by onboarding flow)
  function setUserName(name: string) {
    addUser(name)
  }

  function markIntroSeen() {
    introSeen.value = true
    localStorage.setItem(INTRO_SEEN_KEY, 'true')
  }

  function resetIntro() {
    introSeen.value = false
    localStorage.removeItem(INTRO_SEEN_KEY)
  }

  function clearUser() {
    userName.value = ''
    localStorage.removeItem(ACTIVE_USER_KEY)
  }

  function deleteUser(name: string) {
    allUsers.value = allUsers.value.filter((u) => u !== name)
    saveAllUsers(allUsers.value)
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
  }
}
