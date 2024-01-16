import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { RadioGroupItem, RadioGroupRoot } from './radio-group-base'

type Props = {
  items: { itemId: string; title: string; value: string }[]
} & ComponentPropsWithoutRef<typeof RadioGroupRoot>
const RadioGroup = forwardRef<ElementRef<typeof RadioGroupRoot>, Props>((props, ref) => {
  const { disabled, items, ...rest } = props

  return (
    <RadioGroupRoot {...rest} disabled={disabled} ref={ref}>
      {items.map(item => (
        <RadioGroupItem
          disabled={disabled}
          id={item.itemId}
          key={item.itemId}
          title={item.title}
          value={item.value}
        />
      ))}
    </RadioGroupRoot>
  )
})

RadioGroup.displayName = RadioGroupRoot.displayName

export { RadioGroup }
