export type Account = {
  fullName: string
  username: string
  avatar: string
  passwordHash: string
  hint: string
  country?: string
}

export const DEFAULT_ACCOUNT: Account = {
  fullName: "tahoe",
  username: "tahoe",
  avatar: "🐱",
  passwordHash: "",
  hint: "",
}

export const AVATARS = [
  { emoji: "🐱", gradient: "from-amber-100 to-amber-300" },
  { emoji: "🦊", gradient: "from-orange-200 to-orange-400" },
  { emoji: "🐼", gradient: "from-neutral-100 to-neutral-300" },
  { emoji: "🐸", gradient: "from-green-200 to-green-400" },
  { emoji: "🐙", gradient: "from-pink-200 to-pink-400" },
  { emoji: "🦄", gradient: "from-purple-200 to-purple-400" },
  { emoji: "🐳", gradient: "from-sky-200 to-sky-400" },
  { emoji: "🌵", gradient: "from-lime-200 to-lime-400" },
]

const STORAGE_KEY = "tahoe-account"

export const avatarGradient = (emoji: string) =>
  AVATARS.find((a) => a.emoji === emoji)?.gradient ?? AVATARS[0].gradient

export function loadAccount(): Account | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Account) : null
  } catch {
    return null
  }
}

export function saveAccount(account: Account) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
  } catch {}
}

export function resetAccount() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export async function hashPassword(username: string, password: string) {
  if (!globalThis.crypto?.subtle) return password
  const data = new TextEncoder().encode(`${username}:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(account: Account, password: string) {
  if (!account.passwordHash) return true
  return (await hashPassword(account.username, password)) === account.passwordHash
}
