import type { ComponentPropsWithoutRef } from 'react'
import { useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { flexCenter } from '@/common/flex-center'
import { Button } from '@/ui/button'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import { LucideImage, LucideImageDown, LucideTrash, LucideUndo } from 'lucide-react'

import s from './card-and-deck-image-selector.module.scss'

import {
  ImageInput,
  ImageInputClear,
  ImageInputDelete,
  ImageInputInfo,
  ImageInputTrigger,
} from './image-input-base'
import { ImageInputPlaceholder, ImageInputValuePreview } from './value-preview'

export type CardAndDeckImageSelectorProps = {
  sourceImage?: string
  triggerText?: string
} & Omit<ComponentPropsWithoutRef<typeof ImageInput>, 'sourceImage'>

export const CardAndDeckImageSelector = ({
  triggerText,
  sourceImage,
  onSourceImageChange,
  onValueChange,
  value,
  initialContent,
  ...restProps
}: CardAndDeckImageSelectorProps) => {
  const [localSourceImage, setLocalSourceImage] = useState('')
  const [localResultImage, setLocalResultImage] = useState('')

  const showFileSize = localSourceImage && value && value !== IMAGE_WAS_ERASED

  const cn = {
    root: clsx(s.root),
    trigger: clsx(s.trigger),
    preview: clsx(s.preview),
    button: clsx(s.buttonWithIcon),
    imageInfo: clsx(s.imageInfo),
    imageInfoWrapper: clsx(s.imageInfoWrapper, !showFileSize && s.opaque),
  }

  const showClearButton =
    Boolean((sourceImage || localSourceImage) && initialContent) ||
    (initialContent && (value === IMAGE_WAS_ERASED || localResultImage === IMAGE_WAS_ERASED))

  const showDeleteButton =
    Boolean(value && value.startsWith('data:image')) ||
    Boolean(localResultImage && localResultImage.startsWith('data:image')) ||
    (initialContent && value !== IMAGE_WAS_ERASED)

  const showTriggerButton = !sourceImage && !localSourceImage

  const handleSourceChange = (source: string) => {
    onSourceImageChange && onSourceImageChange(source)
    typeof sourceImage === 'undefined' && setLocalSourceImage(source)
  }

  const handleUpdateValue = (src: string) => {
    onValueChange && onValueChange(src)
    typeof value === 'undefined' && setLocalResultImage(src)
  }

  return (
    <ImageInput
      {...restProps}
      initialContent={initialContent}
      onSourceImageChange={handleSourceChange}
      onValueChange={handleUpdateValue}
      sourceImage={sourceImage || localSourceImage}
      value={value || localResultImage}
    >
      <div className={cn.preview}>
        <ImageInputValuePreview aspect={500 / 200}>
          <ImageInputPlaceholder>
            <LucideImageDown size={'30%'} />
          </ImageInputPlaceholder>
        </ImageInputValuePreview>
        <div className={cn.imageInfoWrapper}>
          <Typography variant={'body2'}>output file size:</Typography>
          <ImageInputInfo className={cn.imageInfo} />
        </div>
      </div>
      <div style={flexCenter}>
        {showTriggerButton && (
          <ImageInputTrigger>
            <Button className={cn.button} variant={'secondary'}>
              <LucideImage size={14} />
              {triggerText && triggerText}
              {!triggerText && (initialContent ? 'change image' : 'add image')}
            </Button>
          </ImageInputTrigger>
        )}
        {showClearButton && (
          <ImageInputClear>
            <Button className={cn.button} variant={'secondary'}>
              <LucideUndo className={s.lucideIcon} size={14} />
              Restore initial image
            </Button>
          </ImageInputClear>
        )}
        {showDeleteButton && (
          <ImageInputDelete>
            <Button className={cn.button} variant={'secondary'}>
              <LucideTrash className={s.lucideIcon} size={14} />
              Delete image
            </Button>
          </ImageInputDelete>
        )}
      </div>
    </ImageInput>
  )
}
