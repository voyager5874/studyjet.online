export const stripObjectEmptyProperties = <T extends object>(obj: T): T => {
  const objCopy: T = { ...obj }
  const keys = Object.keys(obj) as Array<keyof T>

  keys.forEach(key => {
    if (typeof objCopy[key] !== 'boolean' && !objCopy[key]) {
      delete objCopy[key]
    }
  })

  return objCopy
}

export function isObjectEmpty(objectName: object): boolean {
  return JSON.stringify(objectName) === '{}'
}
