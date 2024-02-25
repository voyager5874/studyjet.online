import type {
  CardItem,
  CreateCardParams,
  GetCardsOfDeckQueryFnResponse,
  GetCardsOfDeckResponse,
  GetCardsQueryParams,
  UpdateCardParams,
} from './types'
import type { RootState } from '@/app/store'

// import type { PatchCollection } from '@reduxjs/toolkit/src/query/core/buildThunks'
import { baseApi } from '@/services/api'
import { getChangedData, isObjectEmpty, mutateObjectValues } from '@/utils/objects'

const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCardsOfDeck: builder.query<
      GetCardsOfDeckResponse,
      { id: string; params: GetCardsQueryParams & { text?: string } }
    >({
      queryFn: async ({ id, params }, _api, _extraOptions, baseQuery) => {
        if (!isObjectEmpty(params) && !('text' in params)) {
          try {
            const result = (await baseQuery({
              url: `decks/${id}/cards`,
              method: 'GET',
              params,
            })) as GetCardsOfDeckQueryFnResponse

            if (result?.error) {
              return { error: result.error }
            }

            return { data: result.data }
          } catch (error) {
            return { error } as GetCardsOfDeckQueryFnResponse
          }
        }

        if (!isObjectEmpty(params) && 'text' in params) {
          try {
            const paramsCopy = { ...params }

            delete paramsCopy.text
            delete paramsCopy.answer
            const result = (await baseQuery({
              url: `decks/${id}/cards`,
              method: 'GET',
              params: { ...paramsCopy, question: params.text },
            })) as GetCardsOfDeckQueryFnResponse

            if (result?.error) {
              return { error: result.error }
            }
            if (result.data?.items?.length === 0) {
              try {
                const paramsCopy = { ...params }

                delete paramsCopy.text
                delete paramsCopy.question
                const result = (await baseQuery({
                  url: `decks/${id}/cards`,
                  method: 'GET',
                  params: { ...paramsCopy, answer: params.text },
                })) as GetCardsOfDeckQueryFnResponse

                if (result?.error) {
                  return { error: result.error }
                }

                return { data: result.data }
              } catch (error) {
                return { error } as GetCardsOfDeckQueryFnResponse
              }
            }

            return { data: result.data }
          } catch (error) {
            return { error } as GetCardsOfDeckQueryFnResponse
          }
        }
        try {
          const result = (await baseQuery({
            url: `decks/${id}/cards`,
            method: 'GET',
          })) as GetCardsOfDeckQueryFnResponse

          if (result?.error) {
            return { error: result.error }
          }

          return { data: result.data }
        } catch (error) {
          return { error } as GetCardsOfDeckQueryFnResponse
        }
      },
      providesTags: (result, _err, _args) =>
        result
          ? [
              'Cards',
              { type: 'Cards' as const, id: 'LIST' },
              ...result.items.map(item => ({ type: 'Cards' as const, id: item.id })),
            ]
          : ['Cards'],
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
          ? ['Cards', 'Decks', { type: 'Decks', id: 'LIST' }, { type: 'Decks', id: result.deckId }]
          : ['Cards', 'Decks', { type: 'Decks', id: 'LIST' }],
    }),
    updateCard: builder.mutation<CardItem, UpdateCardParams>({
      query: ({ cardId, body }) => ({
        url: `cards/${cardId}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ cardId, body }, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState

        const entries = api.util.selectInvalidatedBy(state, ['Cards'])

        // const patches = [] as PatchCollection[]
        const patches = []

        let questionImgUrl = null as null | string
        let answerImgUrl = null as null | string

        for (const { originalArgs } of entries) {
          // it would be probably more efficient with deckId provided
          const patch = dispatch(
            api.util.updateQueryData('getCardsOfDeck', originalArgs, draft => {
              const card = draft.items.find(card => card.id === cardId)

              if (card) {
                const patchObj = getChangedData(body, card)

                patchObj?.questionImg && (questionImgUrl = patchObj.questionImg)
                patchObj?.answerImg && (answerImgUrl = patchObj.answerImg)

                mutateObjectValues(card, patchObj)
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
          questionImgUrl && URL.revokeObjectURL(questionImgUrl)
          answerImgUrl && URL.revokeObjectURL(answerImgUrl)
        }
      },

      invalidatesTags: (_result, _error, { cardId }) => [
        { type: 'Cards', id: 'LIST' },
        { type: 'Cards', id: cardId },
      ],
    }),
    deleteCard: builder.mutation<void, string>({
      query: id => ({
        url: `cards/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState

        const entries = api.util.selectInvalidatedBy(state, ['Cards'])

        const patches = []

        for (const { originalArgs } of entries) {
          const patch = dispatch(
            api.util.updateQueryData('getCardsOfDeck', originalArgs, draft => {
              const cardIndex = draft.items.findIndex(card => card.id === id)

              if (cardIndex !== -1) {
                draft?.items?.splice(cardIndex, 1)
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

      invalidatesTags: ['Cards', { type: 'Cards', id: 'LIST' }],
    }),
    getRandomCardFromDeck: builder.query<CardItem, { deckId: string; previousCardId?: string }>({
      query: ({ deckId, previousCardId }) => ({
        url: `decks/${deckId}/learn`,
        method: 'GET',
        params: previousCardId ? { previousCardId } : undefined,
      }),
      //to work with selectInvalidatedBy util within 'rateCardAcquisition', this tag (or some other tag) is needed
      providesTags: (result, _error, _args) => (result ? [{ type: 'Cards', id: result.id }] : []),
    }),
    rateCardAcquisition: builder.mutation<
      CardItem,
      { body: { cardId: string; grade: number }; deckId: string }
    >({
      query: ({ deckId, body }) => ({ url: `decks/${deckId}/learn`, method: 'POST', body }),
      onQueryStarted: async ({ body }, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState

        const entries = api.util.selectInvalidatedBy(state, ['Cards'])

        const patches = []

        for (const { originalArgs } of entries) {
          const getRandomCardFromDeckPatch = dispatch(
            api.util.updateQueryData('getRandomCardFromDeck', originalArgs, draft => {
              body.cardId === draft.id && (draft.shots = draft.shots + 1)
              if (body.cardId === draft.id) {
                draft.grade = body.grade
              }
            })
          )

          patches.push(getRandomCardFromDeckPatch)

          const getCardsOfDeckPatch = dispatch(
            api.util.updateQueryData('getCardsOfDeck', originalArgs, draft => {
              const cardIndex = draft.items.findIndex(card => card.id === body.cardId)

              if (cardIndex !== -1) {
                draft.items[cardIndex].grade = body.grade
              }
            })
          )

          patches.push(getCardsOfDeckPatch)
        }

        try {
          await queryFulfilled
        } catch (error) {
          if (patches.length) {
            patches.forEach(patch => patch.undo())
          }
        }
      },
      // to show right count of shots (views) and grade (stars) tags probably need to be invalidated
      // (especially in case of dialog without routing) - in case of separate page 'optimistic update' will do

      // invalidatesTags: (_result, _error, { body }) => [
      //   { type: 'Cards', id: body.cardId },
      //   'Cards',
      //   { type: 'Cards', id: 'LIST' },
      // ],
    }),
  }),
})

export const {
  useRateCardAcquisitionMutation,
  useGetRandomCardFromDeckQuery,
  useUpdateCardMutation,
  useGetCardsOfDeckQuery,
  useCreateCardMutation,
  useGetCardByIdQuery,
  useDeleteCardMutation,
} = api
