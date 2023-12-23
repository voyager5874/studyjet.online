import type { Orientation } from 'get-orientation/browser'
import type { Area, Point } from 'react-easy-crop'

import type { ChangeEvent, ComponentPropsWithoutRef } from 'react'
import { useRef, useState } from 'react'
import Cropper from 'react-easy-crop'

import { Button } from '@/ui/button'
import { Slider } from '@/ui/slider'
import { Typography } from '@/ui/typography'
import { getBase64DataUrl, getCroppedImageDataUrl, getRotatedImageDataUrl } from '@/utils'
import { clsx } from 'clsx'
import { getOrientation } from 'get-orientation/browser'
import { Image, ImageDown } from 'lucide-react'

import s from './image-input.module.scss'

type Base = {
  cropAspect?: number
  cropShape?: 'rect' | 'round'
  currentImageUrl?: null | string
  emptyInputButtonText?: string
  imageCropSaved?: boolean
  itemName?: string
  nonEmptyInputButtonText?: string
  onChange: (file: null | string) => void
  onClear?: () => void
}

type CustomComponentPropsWithEdit = Base & {
  onImageCropEdit: (file: null | string) => void
  onImageCropSave?: never
}

type CustomComponentPropsWithSave = Base & {
  onImageCropEdit?: never
  onImageCropSave: (file: null | string) => void
}

type CustomComponentProps = CustomComponentPropsWithEdit | CustomComponentPropsWithSave

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
} as { [key in Orientation]: number }

export type ImageInputProps = CustomComponentProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof CustomComponentProps>
export const ImageInput = ({
  onChange,
  currentImageUrl,
  itemName,
  emptyInputButtonText,
  nonEmptyInputButtonText,
  onClear,
  onImageCropSave,
  imageCropSaved,
  cropAspect = 4 / 3,
  onImageCropEdit,
  cropShape = 'rect',
  ...restProps
}: ImageInputProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number[]>([0])
  const [zoom, setZoom] = useState<number[]>([1])

  const croppedAreaPixels = useRef<Area | null>()

  const onCropComplete = async (_croppedArea: Area, newCroppedAreaPixels: Area) => {
    if (croppedAreaPixels) {
      croppedAreaPixels.current = newCroppedAreaPixels
    }
    if (!currentImageUrl || !croppedAreaPixels?.current) {
      return
    }
    try {
      const croppedImageFile = await getCroppedImageDataUrl(
        currentImageUrl,
        croppedAreaPixels.current,
        rotation[0]
      )

      imageCropSaved && onImageCropSave && onImageCropSave(null)
      onImageCropEdit && onImageCropEdit(croppedImageFile)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSaveCrop = async () => {
    if (!currentImageUrl || !croppedAreaPixels?.current) {
      return
    }
    try {
      const croppedImage = await getCroppedImageDataUrl(
        currentImageUrl,
        croppedAreaPixels.current,
        rotation[0]
      )

      onImageCropSave && onImageCropSave(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  const handleResetCrop = () => {
    onImageCropSave && onImageCropSave(null)
    onImageCropEdit && onImageCropEdit(null)
    setZoom([1])
    setCrop({ x: 0, y: 0 })
    setRotation([0])
  }

  const handleZoomChange = (val: number) => {
    setZoom([val])
  }

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    handleResetCrop()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!file || !file.type.includes('image')) {
        return
      }
      const imageDataUrl = await getBase64DataUrl(file)

      try {
        // apply rotation if needed
        const orientation = await getOrientation(file)
        const exifRotation = ORIENTATION_TO_ANGLE[orientation]

        if (exifRotation && imageDataUrl) {
          const ExifRotatedImageDataUrl = await getRotatedImageDataUrl(imageDataUrl, exifRotation)

          onChange(ExifRotatedImageDataUrl)

          return
        }
      } catch (e) {
        console.warn('failed to detect the orientation')
      }
      imageDataUrl && onChange(imageDataUrl)
    }
  }

  const handleClear = () => {
    onClear && onClear()
  }

  console.log('render image-input component')

  const finalEmptyInputButtonText = emptyInputButtonText || `Add ${itemName ? itemName : ''} image`
  const finalNonEmptyInputButtonText =
    nonEmptyInputButtonText || `Clear ${itemName ? itemName : ''} image`

  const classNames = {
    cropperContainer: clsx(s.imageContainer),
    savedCropIndicator: clsx(s.savedSignContainer, !imageCropSaved && s.hidden),
    imagePlaceholderContainer: clsx(s.imagePlaceholderContainer),
    imageControlsContainer: clsx(s.imageControlsContainer),
    buttonWithIcon: clsx(s.buttonWithIcon),
  }

  return (
    <>
      <div className={classNames.cropperContainer}>
        {currentImageUrl && (
          <Cropper
            aspect={cropAspect}
            crop={crop}
            cropShape={cropShape}
            image={currentImageUrl}
            maxZoom={5}
            objectFit={'cover'}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={handleZoomChange}
            rotation={rotation[0]}
            zoom={zoom[0]}
          />
        )}
        <div className={classNames.savedCropIndicator}>
          <Typography variant={'body1'}>Crop saved</Typography>
        </div>
        {!currentImageUrl && (
          <div className={classNames.imagePlaceholderContainer}>
            <ImageDown size={70} />
          </div>
        )}
      </div>
      {currentImageUrl && (
        <div className={classNames.imageControlsContainer}>
          <Typography as={'h3'} variant={'body2'}>
            rotation
          </Typography>
          <Slider
            max={90}
            min={-90}
            onValueChange={setRotation}
            title={'rotation'}
            value={rotation}
          />
          <Typography as={'h3'} variant={'body2'}>
            zoom
          </Typography>
          <Slider max={5} min={1} onValueChange={setZoom} step={0.01} title={'zoom'} value={zoom} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {!onImageCropEdit && <Button onClick={handleSaveCrop}>Save crop</Button>}
            <Button onClick={handleResetCrop}>reset crop</Button>
          </div>
        </div>
      )}
      {!currentImageUrl && (
        <Button asChild className={classNames.buttonWithIcon} variant={'secondary'}>
          <label>
            <Image size={'1em'} />
            {finalEmptyInputButtonText}
            <input {...restProps} accept={'image/*'} hidden onChange={onFileChange} type={'file'} />
          </label>
        </Button>
      )}
      {currentImageUrl && (
        <div className={s.buttonWidthFix}>
          <Button onClick={handleClear} size={'fill'} variant={'secondary'}>
            {finalNonEmptyInputButtonText}
          </Button>
        </div>
      )}
    </>
  )
}
