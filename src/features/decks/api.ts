import type {
  CreateDeckResponse,
  DeleteDeckResponse,
  GetDecksQueryParams,
  GetDecksResponse,
} from './types'
import type { RootState } from '@/app/store'

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
        onQueryStarted: async (id, { dispatch, queryFulfilled, getState }) => {
          const state = getState() as RootState

          const entries = api.util.selectInvalidatedBy(state, ['Decks'])
          // const args = api.util.selectCachedArgsForQuery(state, 'getDecks') //not a function ??

          console.log({ entries })

          let patch

          for (const { endpointName, originalArgs } of entries) {
            if (endpointName !== 'getDecks') {
              continue
            }
            patch = dispatch(
              // todo: Argument type "getDecks" is not assignable to parameter type QueryKeys<Definitions>
              api.util.updateQueryData('getDecks', originalArgs, draft => {
                const deckIndex = draft.items.findIndex(deck => deck.id === id)

                if (deckIndex !== -1) {
                  draft?.items?.splice(deckIndex, 1)
                }
              })
            )
          }

          try {
            await queryFulfilled
          } catch (error) {
            patch && patch.undo()
          }
        },
        // invalidatesTags: ['Decks'], //do not trigger new request. should I?
      }),
    }
  },
})

export const { useGetDecksQuery, useCreateDecksMutation, useDeleteDeckMutation } = api
