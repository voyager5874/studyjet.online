import type { AspectRatioProps } from '@radix-ui/react-aspect-ratio'

import type { ChangeEvent, ComponentPropsWithoutRef, ElementRef, ReactElement } from 'react'
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { AspectRatio } from '@/ui/aspect-ratio'
import { getFileFromUrl, removeFileExtension } from '@/utils'

import { getDefaultValueFileName } from './utils'

type CustomComponentProps = {
  defaultValue?: File | string //is there any way to have a File set beforehand?
  // errorMessage?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (file: File | null) => void
  value?: File | null
}

export type FileInputProps = CustomComponentProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof CustomComponentProps>

export type FileInputRef = Omit<ElementRef<'input'>, 'defaultValue' | 'value'> & {
  defaultValue?: File | string
  value?: File | null
}

type ContextType = {
  clear: () => void
  defaultValue?: File | null | string
  onValueChange?: (value: File | null) => void
  triggerImageSelection: () => void
  value?: File | null
} | null

const defaultContext: ContextType = null

const FileInputContext = createContext<ContextType>(defaultContext)

const FileInput = forwardRef<FileInputRef, FileInputProps>(
  (
    {
      // errorMessage,
      children,
      value,
      onValueChange,
      onChange,
      defaultValue,
      ...restProps
    }: FileInputProps,
    forwardedRef
  ) => {
    const isControlled = typeof value !== 'undefined'

    // will be set to defaultValue via useEffect (fired once)
    const [localValue, setLocalValue] = useState<File | null>(null)

    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]

        if (!file) {
          return
        }

        onValueChange && onValueChange(file)
        onChange && onChange(e)
        !isControlled && setLocalValue(file)
      }
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(forwardedRef, () => {
      // the hook fires only if a ref in the parent is used (runs on every render?)
      // and if ref is not used - there is no point in keeping ref in sync
      // this hook runs before useEffects,
      // useEffect would update fileList of the input, when value prop changes, but since
      // the value on the ref is defined in the return of this function
      // FileInput.ref.value in the parent would be out of sync
      if (isControlled) {
        if (
          (fileInputRef?.current?.files?.length &&
            value?.name !== fileInputRef?.current?.files.item(0)?.name) ||
          (value?.name && !fileInputRef?.current?.files?.length) ||
          (value === null && fileInputRef?.current?.files?.length)
        ) {
          if (value === null || !(value instanceof File)) {
            // setting value to empty string also resets files property
            // setting files property to null has no effect
            fileInputRef?.current?.value && (fileInputRef.current.value = '')
          } else {
            const dataTransfer = new DataTransfer()

            dataTransfer.items.add(value)
            fileInputRef.current && (fileInputRef.current.files = dataTransfer.files)
          }
        }
      }

      if (!isControlled) {
        if (
          (fileInputRef?.current?.files?.length &&
            localValue?.name !== fileInputRef?.current?.files.item(0)?.name) ||
          (localValue?.name && !fileInputRef?.current?.files?.length) ||
          (localValue === null && fileInputRef?.current?.files?.length)
        ) {
          if (localValue === null || !(localValue instanceof File)) {
            fileInputRef?.current?.value && (fileInputRef.current.value = '')
          } else {
            const dataTransfer = new DataTransfer()

            dataTransfer.items.add(localValue)
            fileInputRef.current && (fileInputRef.current.files = dataTransfer.files)
          }
        }
      }

      return {
        ...fileInputRef.current,
        value: fileInputRef.current?.files?.length ? fileInputRef.current?.files.item(0) : null,
        defaultValue: defaultValue,
      } as FileInputRef
    })

    // imperativeHandle hook updates all the values
    // effects seem unnecessary
    // if ref is not used - there is no point in keeping ref in sync

    // useEffect(() => {
    //   if (!fileInputRef.current || isControlled) {
    //     return
    //   }
    //   if (!fileInputRef?.current?.files?.length && !localValue) {
    //     return
    //   }
    //   if (
    //     fileInputRef?.current?.files?.length &&
    //     localValue?.name === fileInputRef?.current?.files.item(0)?.name
    //   ) {
    //     return
    //   }
    //
    //   if (localValue === null || !(localValue instanceof Blob)) {
    //     fileInputRef.current.files = null
    //
    //     return
    //   }
    //   const dataTransfer = new DataTransfer()
    //
    //   dataTransfer.items.add(localValue)
    //   fileInputRef.current.files = dataTransfer.files
    // }, [isControlled, localValue])

    // useEffect(() => {
    //   if (!fileInputRef.current || !isControlled) {
    //     return
    //   }
    //   if (!fileInputRef?.current?.files?.length && !value) {
    //     return
    //   }
    //   if (
    //     fileInputRef?.current?.files?.length &&
    //     value?.name === fileInputRef?.current?.files.item(0)?.name
    //   ) {
    //     return
    //   }
    //
    //   if (value === null || !(value instanceof Blob)) {
    //     fileInputRef.current.files = null
    //     // native input won't fire an onChange when the value prop changes
    //     // onValueChange && onValueChange(null)
    //
    //     return
    //   }
    //   const dataTransfer = new DataTransfer()
    //
    //   dataTransfer.items.add(value)
    //   fileInputRef.current.files = dataTransfer.files
    // }, [isControlled, value])

    useEffect(() => {
      if (!fileInputRef.current || isControlled || !defaultValue) {
        return
      }
      const dataTransfer = new DataTransfer()

      if (typeof defaultValue === 'string') {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image - no issue here?
        // in the case just use an ordinary <img/> within parent for displaying current image from the backend
        getFileFromUrl(defaultValue, getDefaultValueFileName(defaultValue)).then(file => {
          if (file) {
            dataTransfer.items.add(file)
            fileInputRef?.current && (fileInputRef.current.files = dataTransfer.files)
            setLocalValue(file)
          }
        })
      }
      if (defaultValue instanceof File) {
        dataTransfer.items.add(defaultValue)
        fileInputRef.current.files = dataTransfer.files
        setLocalValue(defaultValue)
      }
      // should be run only once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClear = useCallback(() => {
      if (!isControlled) {
        if (defaultValue && typeof defaultValue === 'string') {
          const dataTransfer = new DataTransfer()

          getFileFromUrl(defaultValue, getDefaultValueFileName(defaultValue)).then(file => {
            if (file) {
              dataTransfer.items.add(file)
              fileInputRef?.current && (fileInputRef.current.files = dataTransfer.files)
              setLocalValue(file)
              onValueChange && onValueChange(file)
            }
          })
        }
        if (defaultValue && defaultValue instanceof File) {
          const dataTransfer = new DataTransfer()

          dataTransfer.items.add(defaultValue)
          fileInputRef?.current && (fileInputRef.current.files = dataTransfer.files)
          setLocalValue(defaultValue)
          onValueChange && onValueChange(defaultValue)
        }
        if (!defaultValue) {
          fileInputRef?.current?.value && (fileInputRef.current.value = '')

          setLocalValue(null)
          onValueChange && onValueChange(null)
        }
      }
      if (isControlled) {
        onValueChange && onValueChange(null)
      }
    }, [defaultValue, isControlled, onValueChange])

    const contextValue: ContextType = useMemo(
      () => ({
        defaultValue,
        value: value || localValue || null,
        onValueChange,
        // value: fileInputRef.current?.files?.length ? fileInputRef.current?.files.item(0) : null,
        triggerImageSelection: () => fileInputRef.current?.click(),
        clear: handleClear,
      }),
      [defaultValue, handleClear, localValue, onValueChange, value]
    )

    return (
      <>
        <input {...restProps} hidden onChange={onFileChange} ref={fileInputRef} type={'file'} />
        <FileInputContext.Provider value={contextValue}>{children}</FileInputContext.Provider>
      </>
    )
  }
)

type PreviewProps = AspectRatioProps

const FileInputPreview = ({ ratio = 1, ...restProps }: PreviewProps) => {
  const context = useContext(FileInputContext)

  if (!context) {
    throw new Error('Should be used only inside FileInput scope')
  }

  const { value } = context
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (typeof value === 'undefined') {
      return
    }
    if (value === null) {
      setSrc('')

      return
    }
    const url = URL.createObjectURL(value)

    setSrc(url)

    return () => URL.revokeObjectURL(src)
    // changing src shouldn't trigger this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <>
      <AspectRatio ratio={ratio} src={src} {...restProps} />
    </>
  )
}

const FileInputTrigger = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) => {
  const child = Children.only(children)
  const context = useContext(FileInputContext)

  if (!context) {
    throw new Error('Should be used only inside FileInput scope')
  }

  const { triggerImageSelection } = context

  return (
    <>
      {child &&
        isValidElement(child) &&
        cloneElement(child as ReactElement, {
          ...props,
          onClick: triggerImageSelection,
        })}
    </>
  )
}

const FileInputClear = ({ className, children, ...props }: ComponentPropsWithoutRef<'button'>) => {
  const child = Children.only(children)
  const context = useContext(FileInputContext)

  if (!context) {
    throw new Error('Should be used only inside FileInput scope')
  }

  const { clear, value, defaultValue } = context

  let disabled = false

  if (!value) {
    disabled = true
  }
  if (
    value &&
    defaultValue &&
    typeof defaultValue === 'string' &&
    removeFileExtension(value.name) === removeFileExtension(defaultValue)
  ) {
    disabled = true
  }

  // console.log( { name: child?.type.displayName })

  return (
    <>
      {child &&
        isValidElement(child) &&
        cloneElement(child as ReactElement, {
          ...props,
          onClick: clear,
          disabled,
          'aria-disabled': disabled,
        })}
    </>
  )
}

export { FileInput, FileInputClear, FileInputPreview, FileInputTrigger }
