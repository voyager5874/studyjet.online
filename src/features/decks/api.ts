import type {
  CreateDeckResponse,
  DeckItem,
  DeleteDeckResponse,
  GetDecksQueryParams,
  GetDecksResponse,
  UpdateDeckParams,
} from './types'
import type { RootState } from '@/app/store'

import { baseApi } from '@/services/api'
import { stripObjectEmptyProperties } from '@/utils/objects'

const api = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getDecks: builder.query<GetDecksResponse, GetDecksQueryParams | void>({
        query: params => ({
          url: 'decks',
          method: 'GET',
          params: params ? stripObjectEmptyProperties(params) : {},
        }),
        providesTags: (result, _error, _args) => {
          const itemsTags = result?.items
            ? result.items.map(({ id }) => ({ type: 'Decks' as const, id }))
            : []

          return ['Decks', { type: 'Decks', id: 'LIST' }, ...itemsTags]
        },
      }),
      createDecks: builder.mutation<CreateDeckResponse, FormData>({
        query: body => ({
          url: 'decks',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Decks', { type: 'Decks', id: 'LIST' }],
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

          const patches = []

          for (const { endpointName, originalArgs } of entries) {
            if (endpointName !== 'getDecks') {
              continue
            }
            const patch = dispatch(
              // todo: Argument type "getDecks" is not assignable to parameter type QueryKeys<Definitions>
              api.util.updateQueryData('getDecks', originalArgs, draft => {
                const deckIndex = draft.items.findIndex(deck => deck.id === id)

                if (deckIndex !== -1) {
                  draft?.items?.splice(deckIndex, 1)
                }
              })
            )

            patches.push(patch)
          }

          try {
            await queryFulfilled
          } catch (error) {
            if (patches.length) {
              patches.forEach(patch => patch.undo())
            }
          }
        },
        invalidatesTags: ['Decks'],
      }),
      getDeckById: builder.query<DeckItem, string>({
        query: id => ({
          url: `decks/${id}`,
          method: 'GET',
        }),
        providesTags: (_result, _error, id) => [{ type: 'Decks', id }],
      }),
      updateDeck: builder.mutation<DeckItem, UpdateDeckParams>({
        query: ({ id, body }) => ({
          url: `decks/${id}`,
          method: 'PATCH',
          body,
        }),
        onQueryStarted: async ({ id, body }, { dispatch, queryFulfilled, getState }) => {
          const state = getState() as RootState

          const entries = api.util.selectInvalidatedBy(state, ['Decks'])

          const patches = []
          let coverUrl = 'UNTOUCHED' as null | string

          for (const { originalArgs } of entries) {
            const patch = dispatch(
              api.util.updateQueryData('getDecks', originalArgs, draft => {
                const deck = draft.items.find(deck => deck.id === id)

                if (deck) {
                  const name = body.get('name')
                  const isPrivate = body.get('isPrivate')
                  const coverFile = body.get('cover') as File | null | string

                  if (coverFile instanceof File) {
                    coverUrl = URL.createObjectURL(coverFile)
                  }
                  if (coverFile === '') {
                    coverUrl = null
                  }

                  name && (deck.name = String(name))
                  coverUrl !== 'UNTOUCHED' && (deck.cover = coverUrl)
                  isPrivate && (deck.isPrivate = Boolean(isPrivate))
                }
              })
            )

            patches.push(patch)
          }

          try {
            await queryFulfilled
          } catch (error) {
            if (patches.length) {
              patches.forEach(patch => patch.undo())
            }
            console.error(error)
          } finally {
            coverUrl && URL.revokeObjectURL(coverUrl)
          }
        },
        invalidatesTags: (result, _error, args) =>
          result
            ? ['Decks', { type: 'Decks', id: 'LIST' }, { type: 'Decks', id: args.id }]
            : ['Decks'],
      }),
    }
  },
})

export const {
  useGetDeckByIdQuery,
  useUpdateDeckMutation,
  useGetDecksQuery,
  useCreateDecksMutation,
  useDeleteDeckMutation,
} = api
