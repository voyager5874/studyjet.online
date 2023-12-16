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
      onKeyDown && onKeyDown(e)
      setActive(true)
    }

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
      onClick && onClick(e)
      setActive(true)
    }

    const classNames = {
      input: clsx(
        s.input,
        active && s.whiteOutline,
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

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(e)
      setActive(false)
    }
    const autoId = useId()

    return (
      <div className={s.root}>
        <Typography
          as={'label'}
          className={classNames.label}
          htmlFor={id || autoId}
          variant={'body2'}
        >
          {label}
        </Typography>
        <div className={s.inputContainer}>
          {prefixIcon && <span className={classNames.prefixIcon}>{prefixIcon}</span>}
          <input
            aria-describedby={`${id || autoId}-field-message`}
            className={classNames.input}
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
          {suffixIcon && <span className={classNames.suffixIcon}>{suffixIcon}</span>}
        </div>
        {errorMessage && (
          <Typography
            aria-live={'assertive'}
            className={classNames.error}
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
