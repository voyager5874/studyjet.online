import type {
  CardItem,
  CreateCardParams,
  GetCardsOfDeckResponse,
  GetCardsQueryParams,
  UpdateCardParams,
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
    getCardById: builder.query<CardItem, string>({
      query: id => ({
        url: `cards/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Cards', id }],
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
    updateCard: builder.mutation<CardItem, UpdateCardParams>({
      query: ({ cardId, body }) => ({
        url: `cards/${cardId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { cardId }) => [
        { type: 'Cards', id: 'LIST' },
        { type: 'Cards', id: cardId },
      ],
    }),
  }),
})

export const {
  useUpdateCardMutation,
  useGetCardsOfDeckQuery,
  useCreateCardMutation,
  useGetCardByIdQuery,
} = api
