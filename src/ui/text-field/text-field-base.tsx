import { forwardRef, useState } from 'react'
import type { ComponentProps, ElementRef, FocusEvent, ReactElement } from 'react'

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

    return (
      <div className={s.root}>
        <Typography as={'label'} className={classNames.label} variant={'body2'}>
          {label}
        </Typography>
        <div className={s.inputContainer}>
          {prefixIcon && <span className={classNames.prefixIcon}>{prefixIcon}</span>}
          <input
            className={classNames.input}
            disabled={disabled}
            onBlur={handleBlur}
            onClick={() => setActive(true)}
            onKeyDown={() => setActive(true)}
            ref={forwardedRef}
            type={type}
            value={value}
            {...rest}
          />
          {suffixIcon && <span className={classNames.suffixIcon}>{suffixIcon}</span>}
        </div>
        <Typography className={classNames.error} variant={'error'}>
          {errorMessage || 'placeholder'}
        </Typography>
      </div>
    )
  }
)

TextFieldBase.displayName = 'TextField'

export { TextFieldBase }
