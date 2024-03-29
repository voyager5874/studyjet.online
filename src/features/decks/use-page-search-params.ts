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

export const usePageSearchParams = (baseUrl = '/decks') => {
  const dispatch = useAppDispatch()

  const {
    clearFilters,
    clearQueryParams,
    setMinCardsCount,
    setMaxCardsCount,
    setAuthorId,
    setOrderBy,
    setPerPageCount,
    setCurrentPage,
    setDeckName,
  } = decksActions

  const deckName = useAppSelector(selectDeckName)
  const currentPage = useAppSelector(selectCurrentPage)
  const itemsPerPage = useAppSelector(selectItemsPerPage)
  const minCardsCount = useAppSelector(selectMinCardsCount)
  const maxCardsCount = useAppSelector(selectMaxCardsCount)
  const authorId = useAppSelector(selectAuthorId)
  const orderBy = useAppSelector(selectOrderBy)

  const handlePerPageChange = useCallback(
    (value: number) => {
      dispatch(setPerPageCount({ itemsPerPage: value }))
      dispatch(setCurrentPage({ currentPage: 1 }))
    },
    [dispatch, setPerPageCount, setCurrentPage]
  )

  const handlePageChange = useCallback(
    (value: number) => {
      dispatch(setCurrentPage({ currentPage: value }))
    },
    [dispatch, setCurrentPage]
  )

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

  const handleNameSearch = useCallback(
    (searchString: null | string) => {
      dispatch(setDeckName({ name: searchString }))
      dispatch(setCurrentPage({ currentPage: 1 }))
    },
    [dispatch, setCurrentPage, setDeckName]
  )

  const handleDecksByAuthorIdSearch = useCallback(
    (userId: null | string) => {
      dispatch(setAuthorId({ authorId: userId }))
      dispatch(setCurrentPage({ currentPage: 1 }))
    },
    [dispatch, setAuthorId, setCurrentPage]
  )

  const handleItemsMinCountChange = useCallback(
    (value: null | number | undefined) => {
      dispatch(setMinCardsCount({ minCardsCount: value }))
      dispatch(setCurrentPage({ currentPage: 1 }))
    },
    [dispatch, setCurrentPage, setMinCardsCount]
  )

  const handleItemsMaxCountChange = useCallback(
    (value: null | number | undefined) => {
      dispatch(setMaxCardsCount({ maxCardsCount: value }))
      dispatch(setCurrentPage({ currentPage: 1 }))
    },
    [dispatch, setMaxCardsCount, setCurrentPage]
  )

  const handleResetAllQueries = useCallback(() => {
    dispatch(clearQueryParams())
  }, [clearQueryParams, dispatch])

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [clearFilters, dispatch])

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

    history.replaceState(null, '', `${baseUrl}${query}`)
  }, [
    deckName,
    authorId,
    orderBy,
    currentPage,
    itemsPerPage,
    maxCardsCount,
    minCardsCount,
    baseUrl,
  ])

  let activeFiltersCount = 0

  const params = {
    // itemsPerPage,
    // orderBy,
    minCardsCount,
    maxCardsCount,
    authorId,
    name: deckName,
  }

  const paramsKeys = Object.keys(params)

  paramsKeys.forEach(item => params[item as keyof typeof params] && (activeFiltersCount += 1))

  return {
    activeFiltersCount,
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
    handleItemsMinCountChange,
    handleItemsMaxCountChange,
    handleResetAllQueries,
    handleClearFilters,
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
