import type { ComponentPropsWithoutRef } from 'react'
import { useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { Button } from '@/ui/button'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import { LucideImage, LucideImageDown, LucideTrash } from 'lucide-react'

import s from './deck-cover-input.module.scss'

import { ImageInfo, ImageInput, ImageInputClear, ImageInputTrigger } from './image-input-base'
import { ImageInputPlaceholder, ImageInputValuePreview } from './value-preview'

export const DeckCoverInput = ({
  value,
  defaultValue,
  ...restProps
}: Omit<ComponentPropsWithoutRef<typeof ImageInput>, 'onSourceImageChange' | 'sourceImage'>) => {
  const [sourceImage, setSourceImage] = useState('')

  const showFileSize = sourceImage && value && value !== IMAGE_WAS_ERASED

  const cn = {
    root: clsx(s.root),
    trigger: clsx(s.trigger),
    preview: clsx(s.preview),
    button: clsx(s.buttonWithIcon),
    imageInfo: clsx(s.imageInfo),
    imageInfoWrapper: clsx(s.imageInfoWrapper, !showFileSize && s.opaque),
  }

  const showClearButton = Boolean(sourceImage)

  const showTriggerButton = !showClearButton

  return (
    <ImageInput
      {...restProps}
      defaultValue={defaultValue}
      onSourceImageChange={setSourceImage}
      sourceImage={sourceImage}
      value={value}
    >
      <div className={cn.preview}>
        <ImageInputValuePreview aspect={500 / 200}>
          <ImageInputPlaceholder>
            <LucideImageDown size={'30%'} />
          </ImageInputPlaceholder>
        </ImageInputValuePreview>
        <div className={cn.imageInfoWrapper}>
          <Typography variant={'body2'}>output file size:</Typography>
          <ImageInfo className={cn.imageInfo} />
        </div>
      </div>
      {showTriggerButton && (
        <ImageInputTrigger>
          <Button className={cn.button} variant={'secondary'}>
            <LucideImage size={14} />
            Choose cover image
          </Button>
        </ImageInputTrigger>
      )}
      {showClearButton && (
        <ImageInputClear>
          <Button className={cn.button} variant={'secondary'}>
            <LucideTrash className={s.lucideIcon} size={14} />
            Clear cover image
          </Button>
        </ImageInputClear>
      )}
    </ImageInput>
  )
}
