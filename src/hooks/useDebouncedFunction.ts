import { useCallback, useRef } from 'react'

export function useDebouncedFunction<T>(
  callback: (value: T) => void,
  delay: number = 100
): (value: T) => void {
  const timer = useRef<any>(null)

  return useCallback(
    (value: T) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        callback(value)
      }, delay)
    },
    [callback, delay]
  )
}
