import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { clsx } from 'clsx'

import s from './button.module.scss'

const buttonVariants = cva(s.base, {
  defaultVariants: {
    size: 'default',
    variant: 'primary',
  },
  variants: {
    size: {
      default: '',
      dense: s.dense,
      fill: s.fill,
    },
    variant: {
      ghost: s.ghost,
      icon: s.icon,
      primary: s.primary,
      secondary: s.secondary,
      tertiary: s.tertiary,
    },
  },
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp className={clsx(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
