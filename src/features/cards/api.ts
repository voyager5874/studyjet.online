import type { GetCardsOfDeckResponse, GetCardsQueryParams } from './types'

import { baseApi } from '@/services/api'

const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCardsOfDeck: builder.query<
      GetCardsOfDeckResponse,
      { id: string; params: GetCardsQueryParams }
    >({
      query: ({ id, params }) => ({
        url: `decks/${id}/cards`,
        method: 'GET',
        params: params,
      }),
      providesTags: ['Cards'],
    }),
  }),
})

export const { useGetCardsOfDeckQuery } = api
