import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export interface Size {
  height: number
  width: number
}

export function useHtmlElementSize<T extends HTMLElement>(
  externalRef?: RefObject<T>
): {
  initialSize: Size | null
  ref: RefObject<T>
  size: Size | null
} {
  const [size, setSize] = useState<Size | null>(null)
  const [initialSize, setInitialSize] = useState<Size | null>(null)

  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = externalRef ? externalRef.current : ref.current

    if (!element) {
      return
    }
    if (initialSize === null && size) {
      setInitialSize(size)
    }
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect

      setSize({ width, height })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.unobserve(element)
    }
  }, [ref, externalRef])

  return { size, ref, initialSize }
}
