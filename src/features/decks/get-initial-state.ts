import type { GetDecksQueryParams } from '@/features/decks'

import { parseNumber } from '@/utils'
import { getQueryParams } from '@/utils/url-params'

export const getDecksInitialState = () => {
  // const url = new URL(window.location.href)
  // const path = url.pathname
  //
  // if (path.endsWith('decks')) {
  //   console.log('decks pathname')
  // }
  const params = new URLSearchParams(window.location.search)

  const paramsObject = getQueryParams(params)

  return getTypedDecksQueryParams(paramsObject)
}

function getTypedDecksQueryParams(data: { [key: string]: string }): GetDecksQueryParams {
  const params: GetDecksQueryParams = {
    name: data.name || undefined,
    itemsPerPage: parseNumber(data.itemsPerPage) || undefined,
    currentPage: parseNumber(data.currentPage) || undefined,
    minCardsCount: parseNumber(data.minCardsCount) || undefined,
    maxCardsCount: parseNumber(data.maxCardsCount) || undefined,
    authorId: data.authorId || undefined,
    orderBy: (data.orderBy as GetDecksQueryParams['orderBy']) || undefined,
  }

  const paramsKeys = Object.keys(params) as (keyof typeof params)[]

  paramsKeys.forEach(key => {
    if (!params[key]) {
      delete params[key]
    }
  })

  return params as GetDecksQueryParams
}
