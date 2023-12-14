import type { ComponentPropsWithoutRef, ElementRef, ElementType, ReactNode } from 'react'
import { forwardRef } from 'react'

import { clsx } from 'clsx'

import s from './typography.module.scss'

export const TypographyVariants = [
  'body1',
  'body2',
  'caption',
  'error',
  'h1',
  'h2',
  'h3',
  'large',
  'link1',
  'link2',
  'overline',
  'subtitle1',
  'subtitle2',
] as const

type CustomProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
  variant?: (typeof TypographyVariants)[number]
} & ComponentPropsWithoutRef<T>

export type TypographyProps<T extends ElementType> = CustomProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CustomProps<T>>

function getElementType(
  variant: CustomProps<ElementType>['variant'],
  as?: ElementType
): ElementType {
  if (as) {
    return as
  }
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'link1':
    case 'link2':
      return 'a'
    default:
      return 'p'
  }
}

// function RenderFunction<T extends ElementType>(
//   { as, className, variant = 'body1', ...restProps }: TypographyProps<T>,
//   ref: ElementRef<T>
// ) {
//   const classNames = clsx(s.text, s[variant], className)
//   const Component = getElementType(variant, as)
//
//   return <Component className={classNames} ref={ref} {...restProps} />
// }
//
// export const Typography = forwardRef(RenderFunction) as <T extends ElementType = 'p'>(
//   props: TypographyProps<T> & { ref?: ForwardedRef<ElementType<T>> }
// ) => ReturnType<typeof RenderFunction>

export const Typography = forwardRef(function RenderFunction<T extends ElementType>(
  { as, className, variant = 'body1', ...restProps }: TypographyProps<T>,
  ref: ElementRef<T>
) {
  const classNames = clsx(s[variant], className)
  const Component = getElementType(variant, as)

  return <Component className={classNames} ref={ref} {...restProps} />
})
