import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'
import { getToken, clearToken, isExpired, saveToken, TokenPayload } from '@/lib/token'

interface AuthState {
  user: User | null
  token: string | null
  exp: number | null
}

const initial: AuthState = {
  user: null, token: null, exp: null
}

const persisted = getToken()

const initialState: AuthState = persisted && !isExpired(persisted.exp)
  ? { user: { id: 'me', email: 'test@gmail.com' }, token: persisted.token, exp: persisted.exp }
  : initial

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User, token: string, exp: number }>) => {
      const { user, token, exp } = action.payload
      state.user = user; state.token = token; state.exp = exp
      const payload: TokenPayload = { token, exp }
      saveToken(payload)
    },
    logout: (state) => {
      state.user = null; state.token = null; state.exp = null
      clearToken()
    }
  }
})

export const { setCredentials, logout } = slice.actions
export default slice.reducer
