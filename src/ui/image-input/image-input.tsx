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

type CustomComponentProps = {
  cropAspect?: number
  cropShape?: 'rect' | 'round'
  emptyInputButtonText?: string
  errorMessage?: string
  itemName?: string
  manualSave?: boolean
  nonEmptyInputButtonText?: string
  onChange: (url: readonly string[]) => void
  onClear?: () => void
  value?: readonly string[]
}

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
} as { [key in Orientation]: number }

export type ImageInputProps = CustomComponentProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof CustomComponentProps>
export const ImageInput = ({
  errorMessage,
  value,
  onChange,
  itemName,
  emptyInputButtonText,
  nonEmptyInputButtonText,
  onClear,
  manualSave,
  cropAspect = 4 / 3,
  cropShape = 'rect',
  ...restProps
}: ImageInputProps) => {
  const [cropParams, setCropParams] = useState<Point>({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number[]>([0])
  const [zoom, setZoom] = useState<number[]>([1])

  const croppedAreaPixels = useRef<Area | null>()

  const onCropComplete = async (_croppedArea: Area, newCroppedAreaPixels: Area) => {
    if (croppedAreaPixels) {
      croppedAreaPixels.current = newCroppedAreaPixels
    }
    if (!value || !croppedAreaPixels?.current) {
      return
    }
    try {
      const croppedImageFile = await getCroppedImageDataUrl(
        value[0],
        croppedAreaPixels.current,
        rotation[0]
      )

      // reset crop status when Cropper touched
      Boolean(value[1]) && manualSave && onChange([value[0], ''])

      !manualSave && onChange([value[0], croppedImageFile || ''])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSaveCrop = async () => {
    if (!value || !croppedAreaPixels?.current) {
      return
    }
    try {
      const croppedImage = await getCroppedImageDataUrl(
        value[0],
        croppedAreaPixels.current,
        rotation[0]
      )

      manualSave && onChange([value[0], croppedImage || ''])
    } catch (e) {
      console.error(e)
    }
  }

  const handleResetCrop = () => {
    if (value) {
      onChange([value[0], ''])
    }

    setZoom([1])
    setCropParams({ x: 0, y: 0 })
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
        console.warn('not an image file')

        return
      }

      const imageDataUrl = await getBase64DataUrl(file)

      try {
        // apply exif rotation if needed
        const orientation = await getOrientation(file)
        const exifRotation = ORIENTATION_TO_ANGLE[orientation]

        if (exifRotation && imageDataUrl) {
          const ExifRotatedImageDataUrl = await getRotatedImageDataUrl(imageDataUrl, exifRotation)

          if (ExifRotatedImageDataUrl) {
            onChange([ExifRotatedImageDataUrl, ''])
          }

          return
        }
      } catch (e) {
        console.warn('failed to detect the orientation')
      }
      imageDataUrl && onChange([imageDataUrl, ''])
    }
  }

  const handleClear = () => {
    if (onClear) {
      onClear()
    }
    if (!onClear) {
      onChange(['', ''])
    }
  }

  const finalEmptyInputButtonText = emptyInputButtonText || `Add ${itemName ? itemName : ''} image`
  const finalNonEmptyInputButtonText =
    nonEmptyInputButtonText || `Clear ${itemName ? itemName : ''} image`

  const classNames = {
    cropperContainer: clsx(s.imageContainer),
    savedCropIndicator: clsx(
      s.savedSignContainer,
      value && !value[1] && s.hidden,
      !manualSave && s.hidden
    ),
    imagePlaceholderContainer: clsx(s.imagePlaceholderContainer),
    imageControlsContainer: clsx(s.imageControlsContainer),
    buttonWithIcon: clsx(s.buttonWithIcon),
    imageError: clsx(s.imageErrorContainer),
  }

  return (
    <>
      <div className={classNames.cropperContainer}>
        {value && value[0] && (
          <Cropper
            aspect={cropAspect}
            crop={cropParams}
            cropShape={cropShape}
            image={value[0]}
            maxZoom={5}
            objectFit={'cover'}
            onCropChange={setCropParams}
            onCropComplete={onCropComplete}
            onZoomChange={handleZoomChange}
            rotation={rotation[0]}
            zoom={zoom[0]}
          />
        )}
        <div className={classNames.savedCropIndicator}>
          <Typography variant={'body1'}>Crop saved</Typography>
        </div>
        {(!value || !value[0]) && (
          <div className={classNames.imagePlaceholderContainer}>
            <ImageDown size={70} />
          </div>
        )}
      </div>
      <div className={classNames.imageError}>
        <Typography variant={'error'}>{errorMessage}</Typography>
      </div>
      {value && value[0] && (
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
          {manualSave && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleSaveCrop}>Save crop</Button>
              <Button onClick={handleResetCrop}>reset crop</Button>
            </div>
          )}
        </div>
      )}
      {(!value || !value[0]) && (
        <Button asChild className={classNames.buttonWithIcon} variant={'secondary'}>
          <label>
            <Image size={'1em'} />
            {finalEmptyInputButtonText}
            <input {...restProps} accept={'image/*'} hidden onChange={onFileChange} type={'file'} />
          </label>
        </Button>
      )}
      {value && value[0] && (
        <div className={s.buttonWidthFix}>
          <Button onClick={handleClear} size={'fill'} variant={'secondary'}>
            {finalNonEmptyInputButtonText}
          </Button>
        </div>
      )}
    </>
  )
}
