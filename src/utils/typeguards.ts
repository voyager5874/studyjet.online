import type { ReactNode } from 'react'
import { isValidElement } from 'react'

export function isReactNode(value: unknown): value is ReactNode {
  return typeof value === 'string' || typeof value === 'number' || isValidElement(value)
}
