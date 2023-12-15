import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef, useId } from 'react'

import { Typography } from '@/ui/typography'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { clsx } from 'clsx'
import { Check } from 'lucide-react'

import s from './checkbox.module.scss'

export type CheckboxProps = { label?: string } & ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ id, disabled, label, className, ...props }, ref) => {
    const classNames = {
      container: clsx(s.container),
      root: clsx(s.root, className, disabled && s.disabled),
      label: clsx(s.label, disabled && s.disabled),
      square: clsx(s.square),
      indicator: clsx(s.indicator),
      icon: clsx(s.icon),
    }

    const autoId = useId()

    return (
      <div className={classNames.container}>
        <CheckboxPrimitive.Root
          className={classNames.root}
          ref={ref}
          {...props}
          disabled={disabled}
          id={id || autoId}
        >
          <div className={classNames.square} />
          <CheckboxPrimitive.Indicator className={classNames.indicator}>
            <Check className={classNames.icon} size={14} strokeWidth={3.5} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Typography
          as={'label'}
          className={classNames.label}
          htmlFor={id || autoId}
          variant={'body2'}
        >
          {label}
        </Typography>
      </div>
    )
  }
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
