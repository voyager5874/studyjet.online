import type { ChangeEvent, ComponentPropsWithoutRef } from 'react'
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'

import { clsx } from 'clsx'
import { LucideCheck } from 'lucide-react'

import s from './custom-checkbox.module.scss'

// type NativeInputValue = number | readonly string[] | string

type CustomProps = {
  label?: string
}
type CustomCheckboxProps = CustomProps & Omit<ComponentPropsWithoutRef<'input'>, keyof CustomProps>
export const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (props, forwardedRef) => {
    const { disabled, checked, defaultChecked, id, onChange, label, ...restProps } = props
    const timerId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [localChecked, setLocalChecked] = useState<boolean | undefined>(defaultChecked)
    // const [localValue, setLocalValue] = useState<NativeInputValue | undefined>(
    //   props.defaultValue || ''
    // )

    const [controlled] = useState(typeof checked !== 'undefined')

    if (!controlled && checked) {
      console.warn(
        'You passed a value to an uncontrolled component. You cannot switch from uncontrolled to controlled'
      )
    }

    if (controlled && defaultChecked) {
      console.warn(
        'You have passed defaultChecked and checked at the same time. You have to decide whether controlled or uncontrolled'
      )
    }

    const autoId = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const indicatorRef = useRef<HTMLLabelElement>(null)

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      const eventChecked = e.target.checked

      if (!controlled) {
        setLocalChecked(eventChecked)
      }

      if (indicatorRef?.current && typeof eventChecked !== 'undefined') {
        indicatorRef.current.setAttribute('data-state', eventChecked ? 'checked' : 'unchecked')
      }

      if (inputRef?.current) {
        //for triggering animation and hover effect
        inputRef.current.setAttribute('data-transition', '')
        timerId?.current && clearTimeout(timerId.current)
        timerId.current = setTimeout(() => {
          inputRef?.current && inputRef.current.removeAttribute('data-transition')
        }, 900)
      }

      onChange && onChange(e)
    }

    // causing massive re-render
    // const handleClick = useCallback(() => {
    //   if (!inputRef?.current) {
    //     return
    //   }
    //   inputRef.current.click()
    // }, [])

    useEffect(() => {
      if (inputRef?.current) {
        disabled && inputRef.current.setAttribute('data-disabled', '')
        !disabled && inputRef.current.removeAttribute('data-disabled')
      }
      if (indicatorRef?.current) {
        disabled
          ? indicatorRef.current.setAttribute('data-disabled', '')
          : indicatorRef.current.removeAttribute('data-disabled')
      }
    }, [disabled])

    useEffect(() => {
      if (indicatorRef?.current && !controlled) {
        indicatorRef.current.setAttribute('data-state', localChecked ? 'checked' : 'unchecked')
      }
      // one-time: make input state to be in sync with passed 'defaultChecked' prop
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (indicatorRef?.current && controlled) {
        indicatorRef.current.setAttribute('data-state', checked ? 'checked' : 'unchecked')
      }
      //checked can be changed without onChange event from outside
      // with onChange firing (click on component) there will be double .setAttribute()

      //controlled cannot change
    }, [checked, controlled])

    useImperativeHandle(forwardedRef, () => {
      // spread operator seemingly makes a stale copy -
      // react-hook-form doesn't recognize value/checked from copied ref object -

      // mutate if needed, then return it

      return inputRef.current as HTMLInputElement
    })

    const showCheckSign = controlled ? checked : localChecked

    const cn = {
      container: clsx(s.container, props.disabled && s.disabled),
      input: clsx(s.input),
      labelText: clsx(s.label, props.disabled && s.disabled),
      indicatorContainer: clsx(s.indicatorContainer),
      square: clsx(s.square),
      checkSign: clsx(s.checkSign, !showCheckSign && s.hidden),
    }

    return (
      <div className={cn.container}>
        <label className={cn.indicatorContainer} ref={indicatorRef}>
          <span aria-checked={localChecked} className={cn.square}>
            <LucideCheck className={cn.checkSign} strokeWidth={3.5} />
          </span>
          <input
            className={cn.input}
            id={id || autoId}
            ref={inputRef}
            type={'checkbox'}
            {...restProps}
            checked={checked}
            defaultChecked={localChecked}
            disabled={disabled}
            onChange={handleOnChange}
          />
        </label>

        {label && (
          <label className={cn.labelText} htmlFor={id || autoId}>
            {label}
          </label>
        )}
      </div>
    )
  }
)
