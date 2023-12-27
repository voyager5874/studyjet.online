import type {
  CreateDeckResponse,
  DeleteDeckResponse,
  GetDecksQueryParams,
  GetDecksResponse,
} from './types'

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
      createDecks: builder.mutation<CreateDeckResponse, FormData>({
        query: body => ({
          url: 'decks',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Decks'],
      }),
      deleteDeck: builder.mutation<DeleteDeckResponse, string>({
        query: id => ({
          url: `decks/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Decks'],
      }),
    }
  },
})

export const { useGetDecksQuery, useCreateDecksMutation, useDeleteDeckMutation } = api
