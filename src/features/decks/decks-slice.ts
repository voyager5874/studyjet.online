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
    setMinCardsCount: (
      state,
      action: PayloadAction<{ minCardsCount: GetDecksQueryParams['minCardsCount'] }>
    ) => {
      state.minCardsCount = action.payload.minCardsCount
    },

    setMaxCardsCount: (
      state,
      action: PayloadAction<{ maxCardsCount: GetDecksQueryParams['maxCardsCount'] }>
    ) => {
      state.maxCardsCount = action.payload.maxCardsCount
    },
    clearOrderBy: (state, _action: PayloadAction<void>) => {
      delete state.orderBy
    },
    clearFilters: state => {
      state.name = null
      state.authorId = null
      // state.itemsPerPage = null
      state.minCardsCount = null
      state.maxCardsCount = null
    },

    clearQueryParams: state => {
      const keys = Object.keys(state)

      keys.forEach(key => (state[key as keyof typeof state] = null))
    },
  },
})

export const decksActions = decksSlice.actions
