import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

import s from './button.module.scss'

export const buttonVariants = ['primary', 'secondary', 'tertiary', 'icon', 'ghost'] as const

export const buttonSizes = ['default', 'dense', 'fill'] as const

export type ButtonProps = {
  asChild?: boolean
  size?: (typeof buttonSizes)[number]
  variant?: (typeof buttonVariants)[number]
} & ComponentPropsWithoutRef<'button'>

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { asChild = false, className, size = 'default', variant = 'primary', ...rest } = props

  const Component = asChild ? Slot : 'button'
  const classNames = clsx(s.base, s[size], s[variant], className)

  return <Component className={classNames} ref={ref} {...rest} />
})

Button.displayName = 'Button'

export { Button }
