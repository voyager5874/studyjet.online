import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export interface Size {
  height: number
  width: number
}

export function useElementSize<T extends HTMLElement>(): {
  ref: RefObject<T>
  size: Size | null
} {
  const [size, setSize] = useState<Size | null>(null)

  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current

    if (element) {
      const { width, height } = element.getBoundingClientRect()

      setSize({ width, height })
    }
  }, [ref])

  return { size, ref }
}
