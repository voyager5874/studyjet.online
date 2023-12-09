import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { Typography } from '@/ui/typography'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { clsx } from 'clsx'
import { Check } from 'lucide-react'

import s from './checkbox.module.scss'

export type CheckboxProps = { label?: string } & ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ disabled, label, className, ...props }, ref) => {
    const classNames = {
      root: clsx(s.root, className, disabled && s.disabled),
      label: clsx(s.label, disabled && s.disabled),
      labelText: clsx(s.labelText, disabled && s.disabled),
      indicator: clsx(s.indicator),
      icon: clsx(s.icon),
    }

    return label ? (
      <Typography as={'label'} className={classNames.label} variant={'body2'}>
        <CheckboxPrimitive.Root
          className={classNames.root}
          ref={ref}
          {...props}
          disabled={disabled}
        >
          <CheckboxPrimitive.Indicator className={classNames.indicator}>
            <Check className={classNames.icon} strokeWidth={3.5} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <span className={classNames.labelText}>{label}</span>
      </Typography>
    ) : (
      <CheckboxPrimitive.Root className={classNames.root} ref={ref} {...props}>
        <CheckboxPrimitive.Indicator className={classNames.indicator}>
          <Check className={classNames.icon} strokeWidth={3.5} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  }
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
