import type { RootState } from '@/app/store'

export const selectDeckName = (state: RootState) => state.decks.name
export const selectCurrentPage = (state: RootState) => state.decks.currentPage
export const selectItemsPerPage = (state: RootState) => state.decks.itemsPerPage
export const selectMinCardsCount = (state: RootState) => state.decks.minCardsCount
export const selectMaxCardsCount = (state: RootState) => state.decks.maxCardsCount
export const selectAuthorId = (state: RootState) => state.decks.authorId
export const selectOrderBy = (state: RootState) => state.decks.orderBy

// const itemsPerPage = useAppSelector(state => state.decks.itemsPerPage)
// const minCardsCount = useAppSelector(state => state.decks.minCardsCount)
// const maxCardsCount = useAppSelector(state => state.decks.maxCardsCount)
// const authorId = useAppSelector(state => state.decks.authorId)
// const orderBy = useAppSelector(state => state.decks.orderBy)
