import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { clsx } from 'clsx'

import s from './dropdown-menu.module.scss'

export type DropdownMenuProps = {
  align?: DropdownMenuPrimitive.DropdownMenuContentProps['align']
  trigger?: ReactNode
} & ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>

export const DropdownMenu = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuProps
>((props, forwardedRef) => {
  const { align, children, trigger, ...restProps } = props

  return (
    <DropdownMenuPrimitive.Root {...restProps}>
      {trigger && (
        <DropdownMenuPrimitive.Trigger asChild className={clsx(s.trigger)}>
          {trigger}
        </DropdownMenuPrimitive.Trigger>
      )}
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content align={align} className={clsx(s.content)} ref={forwardedRef}>
          <DropdownMenuPrimitive.Arrow className={clsx(s.arrow)} />
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
})

export const DropdownMenuItem = ({
  children,
  className,
  ...restProps
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) => {
  return (
    <DropdownMenuPrimitive.Item {...restProps} className={clsx(s.item, className)}>
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

export const DropdownMenuSeparator = ({
  className,
  ...restProps
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) => {
  return <DropdownMenuPrimitive.Separator {...restProps} className={clsx(s.separator, className)} />
}
