import type { ComponentPropsWithoutRef, ElementRef, KeyboardEvent } from 'react'
import { forwardRef, useCallback, useEffect, useRef } from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { clsx } from 'clsx'

import s from './slider.module.scss'

type SliderCustomProps =
  | { defaultValue: number[]; displayValues?: boolean; value?: never }
  | { defaultValue?: never; displayValues?: boolean; value?: number[] }
  | { defaultValue?: never; displayValues?: false; value?: never }

export type SliderProps = SliderCustomProps &
  Omit<ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, keyof SliderCustomProps>

export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (props, forwardedRef) => {
    const {
      minStepsBetweenThumbs,
      step,
      onValueChange,
      onValueCommit,
      displayValues,
      orientation,
      ...restProps
    } = props

    const value = props.value || props.defaultValue

    const minValueRef = useRef<HTMLInputElement>(null)
    const maxValueRef = useRef<HTMLInputElement>(null)

    const checkValue = useCallback(
      (value: number[]) => {
        const length = value.length
        const lastElementIndex = length - 1
        const secondElementIndex = 1
        const beforeLastElementIndex = lastElementIndex - 1

        if (!props.value) {
          return { min: String(value[0]), max: String(value[lastElementIndex]), newValue: value }
        }

        const minChanged = value[0] !== props.value[0]
        const maxChanged = value[lastElementIndex] !== props.value[lastElementIndex]
        // const minChanged = value[0] !== Number(minValueRef.current.value)
        // const maxChanged = value[lastElementIndex] !== Number(maxValueRef.current.value)

        const gap = minStepsBetweenThumbs || step || 1

        const newValue = [...value]

        if (minChanged) {
          if (value[0] > props.value[secondElementIndex]) {
            newValue[0] = props.value[lastElementIndex] - gap
          }
        }

        if (maxChanged) {
          if (value[lastElementIndex] - gap < value[beforeLastElementIndex]) {
            newValue[lastElementIndex] = value[beforeLastElementIndex] + gap
          }
        }

        if (props?.max && value[lastElementIndex] > props.max) {
          newValue[lastElementIndex] = props.max
        }

        if (props?.min && value[0] < props.min) {
          newValue[0] = props.min
        }

        return { min: String(newValue[0]), max: String(newValue[lastElementIndex]), newValue }
      },
      [minStepsBetweenThumbs, props.max, props.min, props.value, step]
    )
    const handleValueChange = (value: number[]) => {
      if (!props.value) {
        return
      }

      const { min, max, newValue } = checkValue(value)

      minValueRef?.current?.value && (minValueRef.current.value = min)
      maxValueRef?.current?.value && (maxValueRef.current.value = max)
      onValueChange && onValueChange(newValue)
    }

    const handleValueCommit = (value: number[]) => {
      const { min, max, newValue } = checkValue(value)

      minValueRef?.current?.value && (minValueRef.current.value = min)
      maxValueRef?.current?.value && (maxValueRef.current.value = max)
      onValueCommit && onValueCommit(newValue)
    }

    const handleMinValueChange = (minValue: number) => {
      if (!props?.value?.length) {
        return
      }

      const copy = [...props.value]

      copy.shift()

      const value = [minValue, ...copy]

      onValueChange && handleValueChange(value)
      onValueCommit && handleValueCommit(value)
    }

    const handleMaxValueChange = (maxValue: number) => {
      if (!props?.value || props?.value?.length === 1) {
        return
      }

      const copy = [...props.value]

      copy.pop()

      const value = [...copy, maxValue]

      onValueChange && handleValueChange(value)
      onValueCommit && handleValueCommit(value)
    }

    const handleMinValueInputBlur = () => {
      const number = Number(minValueRef.current?.value)

      handleMinValueChange(number)
    }
    const handleMaxValueInputBlur = () => {
      const number = Number(maxValueRef.current?.value)

      handleMaxValueChange(number)
    }

    const handleLeftInputEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key

      if (key === 'Enter') {
        onValueChange && handleMinValueInputBlur()
      }
    }

    const handleRightInputEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key

      if (key === 'Enter') {
        onValueChange && handleMaxValueInputBlur()
      }
    }

    useEffect(() => {
      if (!value || !minValueRef.current?.value || !maxValueRef.current?.value) {
        return
      }

      const { min, max } = checkValue(value)

      if (value[0] !== Number(minValueRef.current?.value)) {
        minValueRef.current?.value && (minValueRef.current.value = min)
      }

      if (value[value.length - 1] !== Number(maxValueRef.current?.value)) {
        maxValueRef.current?.value && (maxValueRef.current.value = max)
      }
    }, [checkValue, value])

    const classNames = {
      container: clsx(s.container, orientation === 'vertical' && s.verticalContainer),
      root: clsx(s.SliderRoot),
      thumb: clsx(s.SliderThumb),
      valueContainer: clsx(s.valueContainer),
      valueDisplayLeft: clsx(s.valueDisplay),
      valueDisplayRight: clsx(s.valueDisplay),
    }

    return (
      <div className={classNames.container}>
        {displayValues && value && (
          <input
            className={classNames.valueDisplayLeft}
            defaultValue={value?.length ? value[0] : undefined}
            onBlur={handleMinValueInputBlur}
            onKeyDown={handleLeftInputEnterPress}
            ref={minValueRef}
          />
        )}
        <SliderPrimitive.Root
          className={classNames.root}
          defaultValue={props.defaultValue}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          orientation={orientation}
          step={step}
          value={props.value}
          {...restProps}
          ref={forwardedRef}
        >
          <SliderPrimitive.Track className={s.SliderTrack}>
            <SliderPrimitive.Range className={s.SliderRange} />
          </SliderPrimitive.Track>
          {value?.length ? (
            value?.map((_, i) => (
              <SliderPrimitive.SliderThumb className={classNames.thumb} key={i} />
            ))
          ) : (
            <SliderPrimitive.SliderThumb className={classNames.thumb} />
          )}
        </SliderPrimitive.Root>
        {displayValues && value && value.length > 1 && (
          <input
            className={classNames.valueDisplayRight}
            defaultValue={value && value.length > 1 ? value[value.length - 1] : undefined}
            onBlur={handleMaxValueInputBlur}
            onKeyDown={handleRightInputEnterPress}
            ref={maxValueRef}
          />
        )}
      </div>
    )
  }
)

Slider.displayName = SliderPrimitive.Root.displayName
