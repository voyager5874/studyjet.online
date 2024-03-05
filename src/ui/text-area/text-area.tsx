import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ElementRef,
  KeyboardEvent,
  MouseEvent,
  RefObject,
} from 'react'
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './text-area.module.scss'

export type CustomProps = {
  autoHeight?: boolean
  errorMessage?: string
  label?: string
  maxHeight?: number
  onEnter?: () => void
  onValueChange?: (value: string) => void
  resizeable?: 'both' | 'horizontal' | 'none' | 'vertical'
}

export type TextAreaProps = CustomProps &
  Omit<ComponentPropsWithoutRef<'textarea'>, keyof CustomProps>

export const TextArea = forwardRef<ElementRef<'textarea'>, TextAreaProps>(
  (
    {
      maxHeight,
      rows,
      disabled,
      label,
      id,
      onChange,
      onValueChange,
      onEnter,
      value,
      errorMessage,
      className,
      autoHeight = false,
      resizeable = 'none',
      onClick,
      ...restProps
    },
    forwardedRef
  ) => {
    const [active, setActive] = useState(false)

    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const initialHeight = useRef<null | number>(null)

    useEffect(() => {
      if (textAreaRef?.current) {
        if (!textAreaRef?.current?.value) {
          initialHeight.current = textAreaRef.current.offsetHeight
        }
        if (textAreaRef?.current?.value) {
          const requiredHeight = getRequiredHeight(textAreaRef)

          if (maxHeight && autoHeight && requiredHeight) {
            requiredHeight <= maxHeight
              ? (textAreaRef.current.style.height = `${requiredHeight}px`)
              : (textAreaRef.current.style.height = `${maxHeight}px`)
          }
          if (!maxHeight && autoHeight) {
            requiredHeight && (textAreaRef.current.style.height = `${requiredHeight + 12}px`)
          }
        }
      }
    }, [])

    useImperativeHandle(
      forwardedRef,
      () =>
        ({
          ...textAreaRef.current,
        }) as HTMLTextAreaElement
    )

    const autoId = useId()

    if (maxHeight && !autoHeight) {
      throw new Error('maxHeight makes sense only with autoHeight=true')
    }
    if (maxHeight && maxHeight < 0) {
      throw new Error('Wrong maxHeight value')
    }

    if (maxHeight && rows && initialHeight?.current && initialHeight.current > maxHeight) {
      throw new Error(
        `Wrong maxHeight value: pass maxHeight value which exceeds ${initialHeight.current}px`
      )
    }

    const handleAreaTextChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
      onChange && onChange(event)
      onValueChange && onValueChange(event.currentTarget.value)

      if (!autoHeight) {
        return
      }
      if (!textAreaRef?.current) {
        return
      }

      const currentHeight = textAreaRef.current.offsetHeight

      if (!maxHeight) {
        const requiredHeight = getRequiredHeight(textAreaRef)

        textAreaRef.current.style.height =
          currentHeight > requiredHeight ? `${currentHeight}px` : `${requiredHeight}px`

        return
      }

      if (currentHeight && maxHeight) {
        const requiredHeight = getRequiredHeight(textAreaRef)

        if (requiredHeight <= maxHeight && currentHeight < requiredHeight) {
          textAreaRef.current.style.height = `${requiredHeight}px`
        } else {
          textAreaRef.current.style.height = `${currentHeight}px`
        }
      }
    }

    const handleEnterKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
      if (onEnter && event.key === 'Enter') {
        onEnter()
      }
    }

    const handleClick = (e: MouseEvent<HTMLTextAreaElement>) => {
      onClick && onClick(e)
      setActive(true)
      // console.log('click', getElementHeight(textAreaRef))
    }

    const cn = {
      container: clsx(s.container, disabled && s.disabled),
      area: clsx(s.area, active && s.whiteOutline, errorMessage && s.errorInput),
      label: clsx(s.label, disabled && s.disabled),
      error: clsx(!errorMessage && s.transparent),
    }

    return (
      <div className={cn.container}>
        <Typography as={'label'} className={cn.label} htmlFor={id || autoId} variant={'body2'}>
          {label}
        </Typography>
        <textarea
          aria-describedby={`${id || autoId}-field-message`}
          className={cn.area}
          disabled={disabled}
          id={id || autoId}
          onChange={handleAreaTextChange}
          onClick={handleClick}
          onKeyDown={handleEnterKeyPress}
          ref={textAreaRef}
          rows={rows || 1}
          style={{ resize: resizeable }}
          value={value}
          {...restProps}
        />
        {errorMessage && (
          <Typography
            aria-live={'assertive'}
            className={cn.error}
            id={`${id || autoId}-field-message`}
            variant={'error'}
          >
            {errorMessage}
          </Typography>
        )}
        {!errorMessage && (
          <Typography className={s.transparent} variant={'body2'}>
            placeholder
          </Typography>
        )}
      </div>
    )
  }
)

// function getElementHeight(ref: RefObject<any>) {
//   if (!ref?.current) {
//     return null
//   }
//   const offsetHeight = ref.current.offsetHeight
//   const clientHeight = ref.current.clientHeight
//   const boundingClientRect = ref.current.getBoundingClientRect()
//   const initScrollHeight = ref.current.scrollHeight
//
//   //get height which would house all the text
//
//   ref.current.style.height = '0px'
//   const { scrollHeight: requiredHeight } = ref.current
//
//   //restore initial height
//   ref.current.style.height = `${offsetHeight}px`
//
//   return { offsetHeight, boundingClientRect, clientHeight, requiredHeight, initScrollHeight }
// }

//   {
//       "offsetHeight": 69,
//       "boundingClientRect": {
//       "x": 711,
//           "y": 745.6953125,
//           "width": 498,
//           "height": 69,
//           "top": 745.6953125,
//           "right": 1209,
//           "bottom": 814.6953125,
//           "left": 711
//   },
//       "clientHeight": 69,
//       16 * 1.2 * 3 + 2 * 6 = 69.6

//       "scrollHeight": 31,
// (font-size=16px, chrome normal is 1.2 font-size) -> 16 * 1.2 * 1 row + 2*6px (paddings) = 31.2
// if line-height set to 16px -> {offsetHeight: 60, clientHeight: 60, requiredHeight: 28, initScrollHeight: 60}
//       "initScrollHeight": 69
//   }
//       'By default, the chrome line-height: normal is 1.2 times the current font size, and adjusts automatically
//       with the font size unless manually changed.'

// 'line-height: inherit' for textarea seems not to work; look at _boilerplate.scss

function getRequiredHeight(ref: RefObject<any>) {
  if (!ref?.current) {
    return null
  }
  const styles = getComputedStyle(ref?.current)
  const valueString = styles.getPropertyValue('padding')
  const paddingNumber = Number.parseInt(valueString)

  const offsetHeight = ref.current.offsetHeight
  // const clientHeight = ref.current.clientHeight

  ref.current.style.height = '0px'
  const { scrollHeight: requiredHeight } = ref.current

  ref.current.style.height = `${offsetHeight}px`

  return requiredHeight + paddingNumber
}
