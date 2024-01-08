import type {
  CardItem,
  CreateCardParams,
  GetCardsOfDeckResponse,
  GetCardsQueryParams,
} from './types'

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
    createCard: builder.mutation<CardItem, CreateCardParams>({
      query: ({ deckId, body }) => ({
        url: `decks/${deckId}/cards`,
        method: 'POST',
        body,
      }),
      invalidatesTags: result =>
        result
          ? ['Cards', 'Decks', { type: 'Decks', id: 'List' }, { type: 'Decks', id: result.deckId }]
          : ['Cards', 'Decks', { type: 'Decks', id: 'List' }],
    }),
  }),
})

export const { useGetCardsOfDeckQuery, useCreateCardMutation } = api
