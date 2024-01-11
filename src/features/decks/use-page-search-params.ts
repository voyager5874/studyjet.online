import type { GetDecksQueryParams } from '@/features/decks/types'
import type { Sort } from '@/ui/table'

import { useCallback, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { decksActions } from '@/features/decks/decks-slice'
import {
  selectAuthorId,
  selectCurrentPage,
  selectDeckName,
  selectItemsPerPage,
  selectMaxCardsCount,
  selectMinCardsCount,
  selectOrderBy,
} from '@/features/decks/store-selectors'

export const usePageSearchParams = () => {
  const dispatch = useAppDispatch()

  const { setAuthorId, setOrderBy, setPerPageCount, setCurrentPage, setDeckName } = decksActions

  const deckName = useAppSelector(selectDeckName)
  const currentPage = useAppSelector(selectCurrentPage)
  const itemsPerPage = useAppSelector(selectItemsPerPage)
  const minCardsCount = useAppSelector(selectMinCardsCount)
  const maxCardsCount = useAppSelector(selectMaxCardsCount)
  const authorId = useAppSelector(selectAuthorId)
  const orderBy = useAppSelector(selectOrderBy)

  const handlePerPageChange = useCallback((value: number) => {
    dispatch(setPerPageCount({ itemsPerPage: value }))
  }, [])

  const handlePageChange = useCallback((value: number) => {
    dispatch(setCurrentPage({ currentPage: value }))
  }, [])

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

  const handleNameSearch = useCallback((searchString: null | string) => {
    dispatch(setDeckName({ name: searchString }))
    dispatch(setCurrentPage({ currentPage: 1 }))
  }, [])

  const handleDecksByAuthorIdSearch = useCallback((userId: null | string) => {
    dispatch(setAuthorId({ authorId: userId }))
    dispatch(setCurrentPage({ currentPage: 1 }))
  }, [])

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
    handleNameSearch,
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
