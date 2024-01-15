import type { ComponentPropsWithoutRef, ElementRef, KeyboardEvent, PointerEvent } from 'react'
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

    const value = props.value || props.defaultValue || null

    const minValueRef = useRef<HTMLInputElement>(null)
    const maxValueRef = useRef<HTMLInputElement>(null)

    const checkValue = useCallback(
      (newSliderValue: number[]) => {
        const length = newSliderValue.length
        const lastElementIndex = length - 1
        const secondElementIndex = 1
        const beforeLastElementIndex = lastElementIndex - 1

        if (!value) {
          return {
            min: String(newSliderValue[0]),
            max: String(newSliderValue[lastElementIndex]),
            newValue: newSliderValue,
          }
        }

        const minChanged = newSliderValue[0] !== value[0]
        const maxChanged = newSliderValue[lastElementIndex] !== value[lastElementIndex]
        // const minChanged = value[0] !== Number(minValueRef.current.value)
        // const maxChanged = value[lastElementIndex] !== Number(maxValueRef.current.value)

        const gap = minStepsBetweenThumbs || step || 1

        const newValue = [...newSliderValue]

        if (minChanged) {
          if (newSliderValue[0] > value[secondElementIndex]) {
            newValue[0] = value[lastElementIndex] - gap
          }
        }

        if (maxChanged) {
          if (newSliderValue[lastElementIndex] - gap < newSliderValue[beforeLastElementIndex]) {
            newValue[lastElementIndex] = newSliderValue[beforeLastElementIndex] + gap
          }
        }

        if (props?.max && newSliderValue[lastElementIndex] > props.max) {
          newValue[lastElementIndex] = props.max
        }

        if (props?.min && newSliderValue[0] < props.min) {
          newValue[0] = props.min
        }

        return { min: String(newValue[0]), max: String(newValue[lastElementIndex]), newValue }
      },
      [minStepsBetweenThumbs, props.max, props.min, props.value, step]
    )
    const handleValueChange = (newSliderValue: number[]) => {
      if (!value) {
        return
      }

      const { min, max, newValue } = checkValue(newSliderValue)

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
      if (!value?.length) {
        return
      }

      const copy = [...value]

      copy.shift()

      const updatedValue = [minValue, ...copy]

      onValueChange && handleValueChange(updatedValue)
      onValueCommit && handleValueCommit(updatedValue)
    }

    const handleMaxValueChange = (maxValue: number) => {
      if (!value || value?.length === 1) {
        return
      }

      const copy = [...value]

      copy.pop()

      const updatedValue = [...copy, maxValue]

      onValueChange && handleValueChange(updatedValue)
      onValueCommit && handleValueCommit(updatedValue)
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
        handleMinValueInputBlur()
      }
    }

    const handleRightInputEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key

      if (key === 'Enter') {
        handleMaxValueInputBlur()
      }
    }

    const handleThumbMove = (data: { event: PointerEvent<HTMLSpanElement>; index: number }) => {
      if (onValueChange || !displayValues) {
        return
      }

      if (!value) {
        return
      }

      if (!('ariaValueNow' in data.event.target)) {
        return
      }
      if (typeof data.event.target?.ariaValueNow !== 'string') {
        return
      }
      const maxValue = data.event.target?.ariaValueNow

      if (!maxValue) {
        return
      }

      if (data.index === 0) {
        minValueRef.current?.value && (minValueRef.current.value = maxValue)
      }
      if (data.index === value.length - 1) {
        maxValueRef.current?.value && (maxValueRef.current.value = maxValue)
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
          defaultValue={props.defaultValue ? value || undefined : undefined}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          orientation={orientation}
          step={step}
          value={props.value ? value || undefined : undefined}
          {...restProps}
          ref={forwardedRef}
        >
          <SliderPrimitive.Track className={s.SliderTrack}>
            <SliderPrimitive.Range className={s.SliderRange} />
          </SliderPrimitive.Track>
          {value?.length ? (
            value?.map((_, i) => (
              <SliderPrimitive.SliderThumb
                className={classNames.thumb}
                key={i}
                onPointerMove={e => {
                  handleThumbMove({ event: e, index: i })
                }}
              />
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
