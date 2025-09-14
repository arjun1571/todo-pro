export interface TokenPayload {
  token: string
  exp: number // epoch ms
}

const KEY = 'todo_pro_token'

export function saveToken(payload: TokenPayload) {
  localStorage.setItem(KEY, JSON.stringify(payload))
}
export function getToken(): TokenPayload | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as TokenPayload
    return parsed
  } catch {
    return null
  }
}
export function clearToken() {
  localStorage.removeItem(KEY)
}
export function isExpired(exp: number) {
  return Date.now() > exp
}
