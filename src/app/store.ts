import type { TypedUseSelectorHook } from 'react-redux'

import { useDispatch, useSelector } from 'react-redux'

import { appSlice } from '@/app/app-state-slice'
import { decksSlice } from '@/features/decks/decks-slice'
import { baseApi } from '@/services/api'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  reducer: {
    [appSlice.name]: appSlice.reducer,
    [decksSlice.name]: decksSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
