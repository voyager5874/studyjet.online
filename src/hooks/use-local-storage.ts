import { useEffect, useState } from 'react'

export const useLocalStorage = (storageKey: string, fallback: number | object | string = '') => {
  const item = localStorage.getItem(storageKey)

  const reviver = (_key: string, parsedValue: any) => {
    //some checks here
    return parsedValue
  }

  const storageValue = item ? JSON.parse(item, reviver) : fallback

  const [value, setValue] = useState(storageValue)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  return [value, setValue]
}
