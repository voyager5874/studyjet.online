import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef, useState } from 'react'

import { Button } from '@/ui/button'
import { TextFieldBase } from '@/ui/text-field/text-field-base'
import { Eye, EyeOff, Search, X } from 'lucide-react'

export type Props = { onClear?: () => void } & ComponentPropsWithoutRef<typeof TextFieldBase>

const TextField = forwardRef<ElementRef<typeof TextFieldBase>, Props>((props, ref) => {
  const { disabled, type, value, onClear, ...restProps } = props
  const [showContent, setShowContent] = useState(false)

  const getPrefix = () => {
    if (type === 'search') {
      return <Search size={14} />
    }

    return null
  }

  const handleClear = () => {
    onClear && onClear()
  }

  const getSuffix = () => {
    if (type === 'password') {
      return showContent ? (
        <Button disabled={disabled} onClick={() => setShowContent(prev => !prev)} variant={'icon'}>
          <Eye size={14} />
        </Button>
      ) : (
        <Button disabled={disabled} onClick={() => setShowContent(prev => !prev)} variant={'icon'}>
          <EyeOff size={14} />
        </Button>
      )
    }
    if (type === 'search' && value) {
      return (
        <Button disabled={disabled} onClick={handleClear} variant={'icon'}>
          <X size={14} />
        </Button>
      )
    }

    return null
  }

  return (
    <TextFieldBase
      {...restProps}
      disabled={disabled}
      prefixIcon={getPrefix()}
      ref={ref}
      suffixIcon={getSuffix()}
      type={getInputType(type, showContent)}
      value={value}
    />
  )
})

function getInputType<T>(initialType: T, showContent: boolean): T {
  if (initialType === 'password' && !showContent) {
    return 'password' as T
  }
  if (initialType === 'password' && showContent) {
    return 'text' as T
  }

  return initialType
}

export { TextField }
