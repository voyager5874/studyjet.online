import type { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  appUnlocked: false,
}

export const appSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    changeAppUnlockStatus(state, action: PayloadAction<boolean>) {
      state.appUnlocked = action.payload
    },
  },
})

export const { changeAppUnlockStatus } = appSlice.actions

export const selectAppUnlockStatus = (state: RootState): boolean => state.app.appUnlocked
