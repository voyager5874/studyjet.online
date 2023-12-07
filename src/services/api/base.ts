import type { GetDecksResponse } from '@/features/decks/types'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  tagTypes: ['User', 'Decks'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.flashcards.andrii.es/',
    credentials: 'include',
  }),
  endpoints: builder => {
    return {
      getDecks: builder.query<GetDecksResponse, void>({
        query: () => `v1/decks`,
        providesTags: ['Decks'],
      }),
    }
  },
  reducerPath: 'baseApi',
})

export const { useGetDecksQuery } = baseApi
