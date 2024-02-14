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

    if (!element) {
      return
    }

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect

      setSize({ width, height })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.unobserve(element)
    }
  }, [ref])

  return { size, ref }
}
