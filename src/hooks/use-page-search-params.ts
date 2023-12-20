import type { Sort } from '@/ui/table'

import { useSearchParams } from 'react-router-dom'

export const usePageSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const sortProp = getSortParam(searchParams.get('orderBy'))
  const pageQueryParams = getQueryParams(searchParams)

  const handlePerPageChange = (value: number) => {
    const newQuery = {
      ...pageQueryParams,
      itemsPerPage: String(value),
      currentPage: '1',
    }

    setSearchParams(newQuery)
  }

  const handlePageChange = (value: number) => {
    const newQuery = {
      ...pageQueryParams,
      currentPage: String(value),
    }

    setSearchParams(newQuery)
  }

  const handleSortChange = <T>(sort: Sort<T>) => {
    if (!sort) {
      searchParams.delete('orderBy')
      setSearchParams(searchParams)

      return
    }
    const queryString = `${sort.key}-${sort.direction}`
    const newQuery = {
      ...pageQueryParams,
      orderBy: queryString,
      currentPage: '1',
    }

    setSearchParams(newQuery)
  }

  return { sortProp, pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange }
}

function getSortParam<T>(query: null | string): Sort<T> | null {
  if (!query) {
    return null
  }
  const [key, direction] = query.split('-')

  return { key, direction } as Sort<T>
}

function getQueryParams(query: URLSearchParams) {
  const params = {} as { [key: string]: string }

  query.forEach((value, key) => {
    if (value) {
      params[key] = value
    }
  })

  return params
}
