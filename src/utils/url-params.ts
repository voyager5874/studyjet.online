export function getQueryParams(query: URLSearchParams) {
  const params = {} as { [key: string]: string }

  query.forEach((value, key) => {
    if (value) {
      params[key] = value
    }
  })

  return params
}
