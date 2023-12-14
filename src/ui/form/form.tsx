import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { createContext, forwardRef, useContext, useId } from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'

import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

type FormItemContextValue = {
  id: string
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)
const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div className={clsx(className)} ref={ref} {...props} />
      </FormItemContext.Provider>
    )
  }
)

FormItem.displayName = 'FormItem'

const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
      <Slot
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        id={formItemId}
        ref={ref}
        {...props}
      />
    )
  }
)

FormControl.displayName = 'FormControl'

const FormMessage = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message) : children

    if (!body) {
      return null
    }

    return (
      <p className={clsx(className)} id={formMessageId} ref={ref} {...props}>
        {body}
      </p>
    )
  }
)

FormMessage.displayName = 'FormMessage'

export { Form, FormControl, FormField, FormItem, FormMessage, useFormField }
