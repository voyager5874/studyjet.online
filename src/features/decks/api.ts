import type { GetDecksQueryParams, GetDecksResponse } from './types'

import { baseApi } from '@/services/api'

const api = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getDecks: builder.query<GetDecksResponse, GetDecksQueryParams | void>({
        query: params => ({
          url: 'decks',
          method: 'GET',
          params: params ?? {},
        }),
        providesTags: ['Decks'],
      }),
    }
  },
})

export const { useGetDecksQuery } = api

// getDecks: builder.query<DecksResponseType, GetDecksParamsType | void>({
//   query: params => ({
//     url: 'decks',
//     method: 'GET',
//     params: params ?? {},
//   }),
