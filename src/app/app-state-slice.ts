import type { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'dark' as 'dark' | 'light',
}

export const appSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    changeTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload
    },
  },
})

export const { changeTheme } = appSlice.actions

export const selectAppTheme = (state: RootState): 'dark' | 'light' => state.app.theme
