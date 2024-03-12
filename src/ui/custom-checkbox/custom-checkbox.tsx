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
    const { id, onChange, label, ...restProps } = props

    const [localChecked, setLocalChecked] = useState<boolean | undefined>(true)
    // const [localValue, setLocalValue] = useState<NativeInputValue | undefined>(
    //   props.defaultValue || ''
    // )

    const [controlled, _setControlled] = useState(Boolean(props.checked || props.value))

    if (!controlled && props.value) {
      throw new Error('either controlled or uncontrolled - choose wisely')
    }

    const autoId = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const indicatorRef = useRef<HTMLLabelElement>(null)

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      const checked = inputRef?.current?.checked

      if (!controlled) {
        setLocalChecked(checked)
      }
      if (inputRef?.current && typeof checked !== 'undefined') {
        inputRef.current.setAttribute('data-state', checked ? 'checked' : 'unchecked')
      }

      if (indicatorRef?.current && typeof checked !== 'undefined') {
        indicatorRef.current.setAttribute('data-state', checked ? 'checked' : 'unchecked')
      }

      // const value = inputRef?.current?.value

      // if (!controlled) {
      //   setLocalValue(value)
      // }

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
        props.disabled && inputRef.current.setAttribute('data-disabled', '')
        !props.disabled && inputRef.current.removeAttribute('data-disabled')
      }
      if (indicatorRef?.current) {
        props.disabled
          ? indicatorRef.current.setAttribute('data-disabled', '')
          : indicatorRef.current.removeAttribute('data-disabled')
      }
    }, [controlled, localChecked, props.disabled])

    useImperativeHandle(forwardedRef, () => {
      // ref probably should be passed by reference - spread operator makes a stale copy -
      // react-hook-form doesn't recognize value/checked from copied ref object -

      // mutate before return if needed, then return it
      // inputRef?.current && (inputRef.current.value = 'don')

      return inputRef.current as HTMLInputElement
    })

    const showCheckSign =
      (!controlled && localChecked) || (controlled && props.checked) || (controlled && props.value)

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
          <span aria-checked={localChecked} className={cn.square} role={'checkbox'}>
            <LucideCheck className={cn.checkSign} strokeWidth={3.5} />
          </span>
          <input
            className={cn.input}
            id={id || autoId}
            ref={inputRef}
            type={'checkbox'}
            {...restProps}
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
