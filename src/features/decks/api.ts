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
import { getErrorInformation } from '@/utils'
import { getChangedData, mutateObjectValues, stripObjectEmptyProperties } from '@/utils/objects'

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
        transformErrorResponse: (response, _meta, _arg) => {
          return getErrorInformation(response)
        },
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
      getDecksByIdsList: builder.query<
        { items: DeckItem[] } | null,
        { ids: string[]; maxCardsCount?: number; minCardsCount?: number; name?: string }
      >({
        async queryFn({ ids }, _api, _extraOptions, baseQuery) {
          const result = [] as DeckItem[]

          for (const id of ids) {
            try {
              const data = await baseQuery({
                url: `decks/${id}`,
                method: 'GET',
              })

              if (data?.data) {
                result.push(data.data as DeckItem)
              } else {
                return { data: null }
              }
            } catch (error) {
              return { data: null }
            }
          }

          // return { data: { items: filterResults(result, args) } }
          return { data: { items: result } }
        },
        providesTags: (result, _error, { ids }) =>
          result?.items
            ? result.items.map(item => ({ type: 'Decks', id: item.id }))
            : ids.map(id => ({ type: 'Decks', id })),
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
          let coverUrl = null as null | string

          for (const { originalArgs } of entries) {
            const patch = dispatch(
              api.util.updateQueryData('getDecks', originalArgs, draft => {
                const deck = draft.items.find(deck => deck.id === id)

                if (deck) {
                  const patchObj = getChangedData(body, deck)

                  patchObj?.cover && (coverUrl = patchObj.cover)

                  mutateObjectValues(deck, patchObj)
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
  useGetDecksByIdsListQuery,
} = api

// using args and filter within endpoint would cause unnecessary network requests
// function filterResults(
//   response: DeckItem[],
//   arg: { maxCardsCount?: number; minCardsCount?: number; name?: string }
// ) {
//   if (!response?.length) {
//     return []
//   }
//
//   let result = response
//
//   if (arg?.minCardsCount) {
//     result = result.filter(item => {
//       if (!arg?.minCardsCount) {
//         return item
//       }
//
//       return item.cardsCount >= arg.minCardsCount
//     })
//   }
//
//   if (arg?.maxCardsCount) {
//     result = result.filter(item => {
//       if (!arg?.maxCardsCount) {
//         return item
//       }
//
//       return item.cardsCount <= arg.maxCardsCount
//     })
//   }
//
//   if (arg?.name) {
//     const filterFn = (item: DeckItem) => {
//       if (!arg?.name) {
//         return item
//       }
//       const normalizedDeckName = item.name.toLowerCase()
//       const normalizedSearchString = arg.name.trim().toLowerCase()
//
//       return normalizedDeckName.includes(normalizedSearchString)
//     }
//
//     result = result.filter(filterFn)
//   }
//
//   return result
// }
