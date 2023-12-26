export type DeckItem = {
  author: {
    id: string
    name: string
  }
  cardsCount: number
  cover: null | string
  created: string
  id: string
  isBlocked: boolean | null
  isDeleted: boolean | null
  isPrivate: boolean
  name: string
  rating: number
  shots: number
  updated: string
  userId: string
}

export type GetDecksResponse = {
  items: DeckItem[]
  maxCardsCount: number
  pagination: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export type GetDecksQueryParams = {
  authorId?: string
  currentPage?: number
  itemsPerPage?: number
  maxCardsCount?: number
  minCardsCount?: number
  name?: string
  orderBy?:
    | `${keyof Omit<DeckItem, 'author' | 'id'>}-${'asc' | 'desc'}`
    | `author.${keyof DeckItem['author']}-${'asc' | 'desc'}`
}

export type CreateDeckResponse = {
  author: {
    id: string
    name: string
  }
  cardsCount: number
  cover: string
  created: string
  id: string
  isPrivate: boolean
  name: string
  shots: number
  updated: string
  userId: string
}

export type CreateDeckData = {
  cover?: File | null
  isPrivate?: boolean
  name: string
}

export type CreateDeckFormData = {
  cover?: readonly string[]
  isPrivate?: boolean
  name: string
}
