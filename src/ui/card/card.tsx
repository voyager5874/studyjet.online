import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { Children, cloneElement, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

import s from './card.module.scss'

type CardProps = {
  asChild?: boolean
} & ComponentPropsWithoutRef<'div'>

// https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/card.tsx
const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { asChild, children, className, ...restProps } = props
  const Component = asChild ? Slot : 'div'

  const classNames = {
    root: clsx(s.root, className),
    content: clsx(s.cardContent),
  }

  function getChild() {
    const firstChild = Children.only(children) as ReactElement

    return cloneElement(firstChild, {
      children: <div className={classNames.content}>{firstChild.props.children}</div>,
    })
  }

  return (
    <Component className={classNames.root} ref={ref} {...restProps}>
      {asChild ? getChild() : <div className={classNames.content}>{children}</div>}
    </Component>
  )
})

Card.displayName = 'Card'

export { Card }
export type { CardProps }
