import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { RadioGroupItem, RadioGroupRoot } from './radio-group-base'

type Props = { items: { key: string; value: string }[] } & ComponentPropsWithoutRef<
  typeof RadioGroupRoot
>
const RenderFunction = (props: Props) => {
  const { disabled, items, ...rest } = props

  return (
    <RadioGroupRoot {...rest} disabled={disabled}>
      {items.map(item => (
        <RadioGroupItem disabled={disabled} id={item.key} key={item.key} value={item.value} />
      ))}
    </RadioGroupRoot>
  )
}

export const RadioGroup = forwardRef(RenderFunction) as (
  props: Props & { ref?: ForwardedRef<typeof RadioGroupRoot> }
) => ReturnType<typeof RenderFunction>
