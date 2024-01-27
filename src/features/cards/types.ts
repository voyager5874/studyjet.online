import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export type CardItem = {
  answer: string
  answerImg: null | string
  answerVideo: null | string
  created: string
  deckId: string
  grade: number
  id: string
  question: string
  questionImg: null | string
  questionVideo: null | string
  shots: number
  updated: string
  userId: string
}

export type GetCardsOfDeckResponse = {
  items: CardItem[]
  pagination: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export type GetCardsQueryParams = {
  answer?: string
  currentPage?: number
  itemsPerPage?: number
  orderBy?: `${keyof Omit<CardItem, 'id'>}-${'asc' | 'desc'}`
  question?: string
}

export type CreateCardParams = {
  body: FormData
  deckId: string
}

export type UpdateCardParams = {
  body: FormData
  cardId: string
}

export type GetCardsOfDeckQueryFnResponse =
  | { data: GetCardsOfDeckResponse; error: undefined }
  | { data: undefined; error: FetchBaseQueryError }
