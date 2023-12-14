import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { Button } from '@/ui/button'

import { RadioGroupItem, RadioGroupRoot } from './radio-group-base'

type Props = { items: { key: string; value: string }[] } & ComponentPropsWithoutRef<
  typeof RadioGroupRoot
>
const RadioGroup = forwardRef<ElementRef<typeof RadioGroupRoot>, Props>((props, ref) => {
  const { disabled, items, ...rest } = props

  return (
    <RadioGroupRoot {...rest} disabled={disabled} ref={ref}>
      {items.map(item => (
        <RadioGroupItem disabled={disabled} id={item.key} key={item.key} value={item.value} />
      ))}
    </RadioGroupRoot>
  )
})

Button.displayName = 'RadioGroup'

export { RadioGroup }
