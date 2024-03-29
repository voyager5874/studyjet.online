import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { Typography } from '@/ui/typography'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { clsx } from 'clsx'
import { Dot } from 'lucide-react'

import s from './radio-group.module.scss'

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>

export const RadioGroupRoot = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>((props, forwardedRef) => {
  const { orientation, className, ...restProps } = props
  const classNames = {
    root: clsx(s.root, orientation === 'horizontal' && s.horizontal, className),
  }

  return (
    <RadioGroupPrimitive.Root
      {...restProps}
      aria-label={'View density'}
      className={classNames.root}
      defaultValue={'default'}
      ref={forwardedRef}
    />
  )
})

RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>

export const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>((props, forwardedRef) => {
  const { title, id, disabled, value, className, ...restProps } = props

  const classNames = {
    itemContainer: clsx(s.itemContainer),
    item: clsx(s.item, className),
    label: clsx(disabled && s.disabled, id && s.pointer),
    indicator: clsx(s.indicator),
    dot: clsx(s.dot),
  }

  return (
    <div className={classNames.itemContainer}>
      <RadioGroupPrimitive.Item
        className={classNames.item}
        {...restProps}
        disabled={disabled}
        id={id}
        ref={forwardedRef}
        title={title}
        value={value}
      >
        <RadioGroupPrimitive.Indicator className={classNames.indicator}>
          <Dot className={classNames.dot} strokeWidth={8} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <Typography as={'label'} className={classNames.label} htmlFor={id} variant={'body2'}>
        {title}
      </Typography>
    </div>
  )
})

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
