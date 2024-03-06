import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function getErrorInformation(error?: FetchBaseQueryError) {
  if (error && error?.data && typeof error.data === 'object') {
    if ('message' in error.data) {
      return error.data.message as string
    }
    if ('errorMessages' in error.data) {
      // {"status":400,"data":{"errorMessages":[{"field":"password","message":"password must be longer than or equal to 3 characters"}]}}

      if (Array.isArray(error.data.errorMessages)) {
        if (typeof error.data.errorMessages[0] === 'string') {
          return error.data.errorMessages.join('; ')
        }
        if (
          typeof error.data.errorMessages[0] === 'object' &&
          'message' in error.data.errorMessages[0]
        ) {
          return error.data.errorMessages[0].message
        }
      }

      return JSON.stringify(error.data.errorMessages)
    }
  }

  if (error && 'status' in error) {
    if (error.status === 'FETCH_ERROR') {
      return 'network error; check your connection'
    }

    return `error code: ${error.status}`
  }

  return 'something went wrong'
}
