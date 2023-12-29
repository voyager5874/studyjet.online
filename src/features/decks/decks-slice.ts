import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import { getDecksInitialState } from './get-initial-state'

// const initialState: GetDecksQueryParams = {
//   name: null,
//   itemsPerPage: null,
//   currentPage: null,
//   minCardsCount: null,
//   maxCardsCount: null,
//   authorId: null,
//   orderBy: null,
// }

const initialState = getDecksInitialState()

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDeckName: (state, action: PayloadAction<{ deckName: string }>) => {
      state.name = action.payload.deckName
    },

    setCurrentPage: (state, action: PayloadAction<{ currentPage: number }>) => {
      state.currentPage = action.payload.currentPage
    },
    setPerPageCount: (state, action: PayloadAction<{ itemsPerPage: number }>) => {
      state.itemsPerPage = action.payload.itemsPerPage
    },

    clearQueryParams: state => {
      Object.assign(state, initialState)
    },
  },
})

export const decksActions = decksSlice.actions
