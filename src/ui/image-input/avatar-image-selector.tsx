import type { ComponentPropsWithoutRef } from 'react'
import { useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { Button } from '@/ui/button'
import { ImageInput, ImageInputDelete, ImageInputTrigger } from '@/ui/image-input/image-input-base'
import { ImageInputPlaceholder, ImageInputValuePreview } from '@/ui/image-input/value-preview'
import { clsx } from 'clsx'
import { LucideImagePlus, LucidePenLine, LucideTrash, LucideUser } from 'lucide-react'

import s from './avatar-image-selector.module.scss'

export type AvatarInputProps = Omit<
  ComponentPropsWithoutRef<typeof ImageInput>,
  'onSourceImageChange' | 'sourceImage'
>
export const AvatarImageSelector = ({
  className,
  value,
  onValueChange,
  initialContent,
  ...restProps
}: AvatarInputProps) => {
  const cn = {
    root: clsx(s.root),
    trigger: clsx(s.trigger),
    previewContainer: clsx(s.previewContainer, className),
    button: clsx(s.button),
    imageInfo: clsx(s.imageInfo),
    imageInfoWrapper: clsx(s.imageInfoWrapper),
    flexContainer: clsx(s.flexContainer),
    placeholder: clsx(s.placeholder),
    imagePreview: clsx(s.imagePreview),
  }
  const [localSourceImage, setLocalSourceImage] = useState('')
  const [localResultImage, setLocalResultImage] = useState('')

  const showDeleteButton =
    Boolean(value && value.startsWith('data:image')) ||
    Boolean(localResultImage && localResultImage.startsWith('data:image')) ||
    (initialContent && value !== IMAGE_WAS_ERASED && localResultImage !== IMAGE_WAS_ERASED)

  const showTriggerButton = !localSourceImage

  const handleUpdateValue = (src: string) => {
    onValueChange && onValueChange(src)
    typeof value === 'undefined' && setLocalResultImage(src)
  }

  return (
    <ImageInput
      {...restProps}
      initialContent={initialContent}
      onSourceImageChange={setLocalSourceImage}
      onValueChange={handleUpdateValue}
      sourceImage={localSourceImage}
      value={value || localResultImage}
    >
      <div className={cn.flexContainer}>
        <div className={cn.previewContainer}>
          <ImageInputValuePreview
            aspect={1}
            className={cn.imagePreview}
            cropShape={'round'}
            showGrid={false}
          >
            <ImageInputPlaceholder>
              <LucideUser size={'70%'} />
            </ImageInputPlaceholder>
          </ImageInputValuePreview>
          {showTriggerButton && (
            <ImageInputTrigger>
              <Button className={cn.button} size={'dense'} variant={'secondary'}>
                {value !== IMAGE_WAS_ERASED &&
                localResultImage !== IMAGE_WAS_ERASED &&
                (localSourceImage || initialContent) ? (
                  <LucidePenLine size={14} />
                ) : (
                  <LucideImagePlus size={14} />
                )}
              </Button>
            </ImageInputTrigger>
          )}
          {showDeleteButton && (
            <ImageInputDelete>
              <Button className={cn.button} size={'dense'} variant={'secondary'}>
                <LucideTrash className={s.lucideIcon} size={14} />
              </Button>
            </ImageInputDelete>
          )}
        </div>
      </div>
    </ImageInput>
  )
}
