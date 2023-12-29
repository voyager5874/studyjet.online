import type { GetDecksQueryParams } from '@/features/decks/types'
import type { Sort } from '@/ui/table'

import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { decksActions } from '@/features/decks/decks-slice'

export const usePageSearchParams = () => {
  const dispatch = useAppDispatch()

  const { setAuthorId, setOrderBy, setPerPageCount, setCurrentPage, setDeckName } = decksActions

  const deckName = useAppSelector(state => state.decks.name)
  const currentPage = useAppSelector(state => state.decks.currentPage)
  const itemsPerPage = useAppSelector(state => state.decks.itemsPerPage)
  const minCardsCount = useAppSelector(state => state.decks.minCardsCount)
  const maxCardsCount = useAppSelector(state => state.decks.maxCardsCount)
  const authorId = useAppSelector(state => state.decks.authorId)
  const orderBy = useAppSelector(state => state.decks.orderBy)

  const handlePerPageChange = (value: number) => {
    dispatch(setPerPageCount({ itemsPerPage: value }))
  }

  const handlePageChange = (value: number) => {
    dispatch(setCurrentPage({ currentPage: value }))
  }

  const handleSortChange = <T>(sort: Sort<T>) => {
    if (!sort) {
      dispatch(setOrderBy({ orderBy: null }))
      dispatch(setCurrentPage({ currentPage: 1 }))

      return
    }
    const queryString = `${sort.key}-${sort.direction}` as GetDecksQueryParams['orderBy']

    dispatch(setOrderBy({ orderBy: queryString }))
    dispatch(setCurrentPage({ currentPage: 1 }))
  }

  const tableSortProp = getSortParam(orderBy)

  const handleNameSearchRaw = (searchString: null | string) => {
    dispatch(setDeckName({ name: searchString }))
    dispatch(setCurrentPage({ currentPage: 1 }))
  }

  const handleDecksByAuthorIdSearch = (userId: null | string) => {
    dispatch(setAuthorId({ authorId: userId }))
    dispatch(setCurrentPage({ currentPage: 1 }))
  }

  useEffect(() => {
    const query = stateToQueryString({
      currentPage,
      itemsPerPage,
      orderBy,
      minCardsCount,
      maxCardsCount,
      authorId,
      name: deckName,
    })

    history.replaceState(null, '', `/decks${query}`)
  }, [deckName, authorId, orderBy, currentPage, itemsPerPage, maxCardsCount, minCardsCount])

  return {
    tableSortProp,
    name: deckName,
    authorId,
    orderBy,
    currentPage,
    itemsPerPage,
    maxCardsCount,
    minCardsCount,
    handlePerPageChange,
    handlePageChange,
    handleSortChange,
    handleDecksByAuthorIdSearch,
    handleNameSearchRaw,
  }
}

function getSortParam<T>(query: GetDecksQueryParams['orderBy']): Sort<T> | null {
  if (!query) {
    return null
  }
  const [key, direction] = query.split('-')

  return { key, direction } as Sort<T>
}

function stateToQueryString(state: GetDecksQueryParams) {
  const keys = Object.keys(state) as (keyof GetDecksQueryParams)[]
  const params = keys.filter(
    key => state[key] !== undefined && state[key] !== '' && state[key] !== null
  )

  if (params.length === 0) {
    return ''
  }
  const query = params.map(key => `${key}=${state[key]}`).join('&')

  return '?' + query
}
