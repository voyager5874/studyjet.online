import type { RefObject } from 'react'

export function getRefContentFullCopy<T extends HTMLElement>(ref: RefObject<T> | null) {
  const fullRefContent = {} as Partial<T>

  if (!ref?.current) {
    return null
  }
  if (ref?.current) {
    //including inherited properties
    for (const key in ref?.current) {
      // @ts-ignore
      fullRefContent[key as keyof T] = ref.current[key as keyof T]
    }
  }

  return fullRefContent
}
