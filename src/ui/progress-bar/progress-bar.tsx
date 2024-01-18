import * as React from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import { clsx } from 'clsx'

import s from './progress-bar.module.scss'

export type ProgressBarProps = {
  show: boolean
} & ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ show, className, value, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root className={clsx(s.root, className)} ref={ref} {...props}>
      <ProgressPrimitive.Indicator
        className={clsx(
          value && show && s.indicator,
          !value && show && s.indicatorUncontrolled,
          !show && s.hidden
        )}
        style={value ? { transform: `translateX(-${100 - value}%)` } : {}}
      />
    </ProgressPrimitive.Root>
  )
})

ProgressBar.displayName = ProgressPrimitive.Root.displayName

export { ProgressBar }
