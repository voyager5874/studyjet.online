import { forwardRef, useId, useState } from 'react'
import type {
  ComponentProps,
  ElementRef,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
} from 'react'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './text-field.module.scss'

export type TextFieldProps = {
  errorMessage?: string
  label?: string
  prefixIcon?: ReactElement | null
  suffixIcon?: ReactElement | null
  /** Show or hide */
  type?: 'password' | 'search' | 'text'
} & Omit<ComponentProps<'input'>, 'type'>

const TextFieldBase = forwardRef<ElementRef<'input'>, TextFieldProps>(
  (props: TextFieldProps, forwardedRef) => {
    const {
      onKeyDown,
      onClick,
      id,
      onBlur,
      prefixIcon,
      suffixIcon,
      value,
      label,
      errorMessage,
      disabled,
      type = 'text',
      children,
      ...rest
    } = props

    const [active, setActive] = useState(false)

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      !active && setActive(true)
      onKeyDown && onKeyDown(e)
      setActive(true)
    }

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
      onClick && onClick(e)
      setActive(true)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(e)
      setActive(false)
    }
    const autoId = useId()

    const cn = {
      input: clsx(
        s.input,
        active && s.active,
        errorMessage && s.error,
        prefixIcon && s.inputWithPrefix,
        suffixIcon && s.inputWithSuffix,
        errorMessage && s.errorInput
      ),
      label: clsx(s.label, disabled && s.disabled),
      error: clsx(!errorMessage && s.transparent),
      prefixIcon: clsx(s.prefixIcon),
      suffixIcon: clsx(s.suffixIcon),
    }

    return (
      <div className={s.root}>
        <Typography as={'label'} className={cn.label} htmlFor={id || autoId} variant={'body2'}>
          {label}
        </Typography>
        <div className={s.inputContainer}>
          {prefixIcon && <div className={cn.prefixIcon}>{prefixIcon}</div>}
          <input
            aria-describedby={`${id || autoId}-field-message`}
            className={cn.input}
            disabled={disabled}
            id={id || autoId}
            onBlur={handleBlur}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            ref={forwardedRef}
            type={type}
            value={value}
            {...rest}
          />
          {suffixIcon && <div className={cn.suffixIcon}>{suffixIcon}</div>}
        </div>
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

TextFieldBase.displayName = 'TextField'

export { TextFieldBase }
