import type { TypographyProps } from '@/ui/typography'

import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { Typography } from '@/ui/typography'
import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'

import s from './select.module.scss'

export type SelectProps = {
  dense?: boolean
  fullWidth?: boolean
  label?: string
  placeholder?: string
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Root>
export const Select = forwardRef<ElementRef<typeof SelectPrimitive.Trigger>, SelectProps>(
  ({ disabled, placeholder, label, dense, fullWidth, children, ...props }, forwardedRef) => {
    const classNames = {
      trigger: clsx(s.trigger, fullWidth && s.fullWidth, dense && s.dense),
      value: clsx(disabled && disabled),
      triggerIcon: clsx(s.triggerIcon),
      label: clsx(s.label, disabled && s.disabled),
      container: clsx(fullWidth && s.fullWidth),
    }

    return (
      <SelectPrimitive.Root {...props} disabled={disabled}>
        {label ? (
          <label className={classNames.container}>
            <Typography as={'span'} className={classNames.label} variant={'body2'}>
              {label}
            </Typography>
            <SelectPrimitive.Trigger className={classNames.trigger} ref={forwardedRef}>
              <Typography
                as={SelectPrimitive.Value}
                className={classNames.value}
                placeholder={placeholder}
                variant={'body1'}
              />
              <SelectPrimitive.Icon asChild className={classNames.triggerIcon}>
                <ChevronDown size={16} />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
          </label>
        ) : (
          <SelectPrimitive.Trigger className={classNames.trigger} ref={forwardedRef}>
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild className={classNames.triggerIcon}>
              <ChevronDown size={16} />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
        )}
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={s.content} position={'popper'}>
            <SelectPrimitive.ScrollUpButton>
              <ChevronUp size={16} />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton>
              <ChevronDown size={16} />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    )
  }
)

export type SelectItemProps = { dense?: boolean } & ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
>

export const SelectItem = forwardRef<ElementRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  ({ dense, className, children, ...props }, forwardedRef) => {
    const classNames = {
      item: clsx(s.item, dense && s.dense, className),
    }

    const typographyVariant: TypographyProps<'span'>['variant'] = dense ? 'body2' : 'body1'

    return (
      <SelectPrimitive.Item {...props} className={classNames.item} ref={forwardedRef}>
        <Typography as={SelectPrimitive.ItemText} variant={typographyVariant}>
          {children}
        </Typography>
      </SelectPrimitive.Item>
    )
  }
)
