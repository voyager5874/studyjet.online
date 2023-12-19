export function parseNumber(value: any) {
  if (!value) {
    return null
  }
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const result = parseInt(value, 10) || null

    return Number.isNaN(result) ? null : result
  }
}
