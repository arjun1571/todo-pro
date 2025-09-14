import { createSlice } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'
interface UIState { theme: Theme }
const initialState: UIState = {
  theme: (localStorage.getItem('todo_pro_theme') as Theme) ?? 'light'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('todo_pro_theme', state.theme)
    }
  }
})
export const { toggleTheme } = uiSlice.actions
export default uiSlice.reducer
