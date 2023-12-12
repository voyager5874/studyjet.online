import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { Typography } from '@/ui/typography'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { clsx } from 'clsx'

import s from './slider.module.scss'

export type RangeSliderProps = { showValues?: boolean } & ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
>

export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  (props, forwardedRef) => {
    const { showValues, orientation } = props
    const value = props.value || props.defaultValue
    const classNames = {
      container: clsx(s.container, orientation === 'vertical' && s.verticalContainer),
      valueContainer: clsx(s.valueContainer),
    }

    return (
      <div className={classNames.container}>
        {showValues && (
          <Typography as={'div'} className={classNames.valueContainer} variant={'body1'}>
            {value?.length ? value[0] : 'N/A'}
          </Typography>
        )}
        <SliderPrimitive.Root
          className={s.SliderRoot}
          defaultValue={props.defaultValue}
          orientation={orientation}
          value={props.value}
          {...props}
          ref={forwardedRef}
        >
          <SliderPrimitive.Track className={s.SliderTrack}>
            <SliderPrimitive.Range className={s.SliderRange} />
          </SliderPrimitive.Track>
          {value?.length ? (
            value?.map((_, i) => <SliderPrimitive.SliderThumb className={s.SliderThumb} key={i} />)
          ) : (
            <SliderPrimitive.SliderThumb className={s.SliderThumb} />
          )}
        </SliderPrimitive.Root>
        {showValues && (
          <Typography as={'div'} className={classNames.valueContainer} variant={'body1'}>
            {value && value.length > 1 ? value[1] : 'N/A'}
          </Typography>
        )}
      </div>
    )
  }
)

Slider.displayName = SliderPrimitive.Root.displayName
