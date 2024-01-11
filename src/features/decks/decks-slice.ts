import type { GetDecksQueryParams } from '@/features/decks/types'
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import { getDecksInitialState } from './get-initial-slice-state'

const initialState = getDecksInitialState()

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDeckName: (state, action: PayloadAction<{ name: GetDecksQueryParams['name'] }>) => {
      state.name = action.payload.name
    },

    setCurrentPage: (
      state,
      action: PayloadAction<{ currentPage: GetDecksQueryParams['currentPage'] }>
    ) => {
      state.currentPage = action.payload.currentPage
    },
    setPerPageCount: (
      state,
      action: PayloadAction<{ itemsPerPage: GetDecksQueryParams['itemsPerPage'] }>
    ) => {
      state.itemsPerPage = action.payload.itemsPerPage
    },
    setOrderBy: (state, action: PayloadAction<{ orderBy: GetDecksQueryParams['orderBy'] }>) => {
      state.orderBy = action.payload.orderBy
    },

    setAuthorId: (state, action: PayloadAction<{ authorId: GetDecksQueryParams['authorId'] }>) => {
      state.authorId = action.payload.authorId
    },
    clearOrderBy: (state, _action: PayloadAction<void>) => {
      delete state.orderBy
    },
    clearQueryParams: state => {
      Object.assign(state, initialState)
    },
  },
})

export const decksActions = decksSlice.actions
