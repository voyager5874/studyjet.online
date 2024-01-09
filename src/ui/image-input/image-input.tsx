import type { Area, Point } from 'react-easy-crop'

import type { ChangeEvent, ComponentPropsWithoutRef } from 'react'
import { useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'

import { BYTES_IN_MB } from '@/common/const/file-size-units'
import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { useElementSize } from '@/hooks'
import { Button } from '@/ui/button'
import { Slider } from '@/ui/slider'
import { Typography } from '@/ui/typography'
import {
  ORIENTATION_TO_ANGLE,
  getBase64DataUrl,
  getCroppedImageDataUrl,
  getFileFromUrl,
  getRotatedImageDataUrl,
} from '@/utils'
import { clsx } from 'clsx'
import { getOrientation } from 'get-orientation/browser'
import { Image, ImageDown } from 'lucide-react'

import s from './image-input.module.scss'

type CustomComponentProps = {
  cropAspect?: number
  cropParamsValue?: Point
  cropShape?: 'rect' | 'round'
  defaultImage?: null | string
  emptyInputButtonText?: string
  errorMessage?: string
  itemName?: string
  manualSave?: boolean
  nonEmptyInputButtonText?: string
  onChange: (url: readonly string[]) => void
  onClear?: () => void
  onCropParamsChange?: (params: Point) => void
  onRotationChange?: (rotation: number) => void
  onZoomChange?: (zoom: number) => void
  rotationValue?: number
  value?: readonly string[]
  zoomValue?: number
}

export type ImageInputProps = CustomComponentProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof CustomComponentProps>
export const ImageInput = ({
  cropParamsValue,
  zoomValue,
  rotationValue,
  onRotationChange,
  onCropParamsChange,
  onZoomChange,
  errorMessage,
  defaultImage,
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
  const [cropParams, setCropParams] = useState<Point>(cropParamsValue || { x: 0, y: 0 })
  const [rotation, setRotation] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(zoomValue || 1)
  const [cropFileSize, setCropFileSize] = useState<null | number>(null)

  const croppedAreaPixels = useRef<Area | null>()

  const [showDefaultImage, setShowDefaultImage] = useState<boolean>(Boolean(defaultImage))

  const { size, ref: containerRef } = useElementSize<HTMLDivElement>()

  const onCropComplete = async (_croppedArea: Area, newCroppedAreaPixels: Area) => {
    if (croppedAreaPixels) {
      croppedAreaPixels.current = newCroppedAreaPixels
    }
    if (!value || !croppedAreaPixels?.current) {
      return
    }

    // reset crop status when Cropper touched
    if (manualSave) {
      Boolean(value[1]) && onChange([value[0], ''])
    }

    // save new crop every time Cropper touched
    if (!manualSave) {
      try {
        const croppedImageDataUrl = await getCroppedImageDataUrl(
          value[0],
          croppedAreaPixels.current,
          rotation
        )

        onChange([value[0], croppedImageDataUrl || ''])
      } catch (e) {
        console.error(e)
      }
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
        rotation
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

    setZoom(1)
    setCropParams({ x: 0, y: 0 })
    setRotation(0)
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
      defaultImage && onChange([IMAGE_WAS_ERASED, ''])
      !defaultImage && onChange(['', ''])
      defaultImage && setShowDefaultImage(false)
    }
  }

  const imageCrop = value ? value[1] : null

  useEffect(() => {
    async function getFileSize(dataUrl: null | string) {
      if (!dataUrl) {
        return null
      }
      const file = await getFileFromUrl(dataUrl)

      if (file) {
        return file.size / BYTES_IN_MB
      }

      return null
    }
    getFileSize(imageCrop).then(size => setCropFileSize(size))
  }, [imageCrop])

  useEffect(() => {
    onCropParamsChange && onCropParamsChange(cropParams)
  }, [cropParams, onCropParamsChange])

  useEffect(() => {
    onZoomChange && onZoomChange(zoom)
  }, [zoom, onZoomChange])

  useEffect(() => {
    onRotationChange && onRotationChange(rotation)
  }, [rotation, onRotationChange])

  const classNames = {
    imageContainer: clsx(s.imageContainer, !size?.width && s.opaque),
    savedCropIndicator: clsx(
      s.savedSignContainer,
      value && !value[1] && s.hidden,
      !manualSave && s.hidden
    ),
    imagePlaceholderContainer: clsx(s.imagePlaceholderContainer),
    defaultImageContainer: clsx(s.defaultImageContainer),
    image: clsx(s.image),
    imageControlsContainer: clsx(s.imageControlsContainer),
    buttonWithIcon: clsx(s.buttonWithIcon),
    imageInfo: clsx(s.imageInfoContainer),
  }

  const handleRotateViaSlider = (sliderValue: number[]) => {
    setRotation(sliderValue[0])
  }

  const handleZoomViaSlider = (sliderValue: number[]) => {
    setZoom(sliderValue[0])
  }

  const finalEmptyInputButtonText = emptyInputButtonText || `Add ${itemName ? itemName : ''} image`
  const finalNonEmptyInputButtonText =
    nonEmptyInputButtonText || `Clear ${itemName ? itemName : ''} image`

  let originalFileUrl

  if (value && value[0] !== IMAGE_WAS_ERASED) {
    originalFileUrl = value[0]
  }
  const showPlaceholder = !originalFileUrl && !showDefaultImage
  const fileChosen = !!originalFileUrl
  const noImageDisplayed = !fileChosen && !showDefaultImage
  const someImageDisplayed = fileChosen || showDefaultImage
  const localImageDisplayed = fileChosen && !showDefaultImage

  // todo: https://pqina.nl/blog/set-value-to-file-input/
  // todo: work around different images ratio loaded by other app implementations -> probably conditionally set 'object-fit: scale-down'
  return (
    <>
      <div
        className={classNames.imageContainer}
        ref={containerRef}
        style={{ height: size?.width ? `${size?.width / cropAspect}px` : '200px' }}
      >
        {localImageDisplayed && (
          <Cropper
            aspect={cropAspect}
            crop={cropParams}
            cropShape={cropShape}
            image={originalFileUrl}
            maxZoom={5}
            objectFit={'cover'}
            onCropChange={setCropParams}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            rotation={rotation}
            zoom={zoom}
          />
        )}
        <div className={classNames.savedCropIndicator}>
          <Typography variant={'body1'}>Crop saved</Typography>
        </div>
        {showPlaceholder && (
          <div className={classNames.imagePlaceholderContainer}>
            <ImageDown size={70} />
          </div>
        )}
        {defaultImage && showDefaultImage && (
          <div className={classNames.imageContainer}>
            <img alt={'cover image'} className={classNames.image} src={defaultImage} />
          </div>
        )}
      </div>
      <div className={classNames.imageInfo}>
        {errorMessage && <Typography variant={'error'}>{errorMessage}</Typography>}
        {!errorMessage && cropFileSize && (
          <Typography variant={'body2'}>
            output file size: {`${cropFileSize.toFixed(2)}MB`}
          </Typography>
        )}
      </div>
      {localImageDisplayed && (
        <div className={classNames.imageControlsContainer}>
          <Typography as={'h3'} variant={'body2'}>
            rotation
          </Typography>
          <Slider
            max={90}
            min={-90}
            onValueChange={handleRotateViaSlider}
            title={'rotation'}
            value={[rotation]}
          />
          <Typography as={'h3'} variant={'body2'}>
            zoom
          </Typography>
          <Slider
            max={5}
            min={1}
            onValueChange={handleZoomViaSlider}
            step={0.01}
            title={'zoom'}
            value={[zoom]}
          />
          {manualSave && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleSaveCrop}>Save crop</Button>
              <Button onClick={handleResetCrop}>reset crop</Button>
            </div>
          )}
        </div>
      )}
      {noImageDisplayed && (
        <Button asChild className={classNames.buttonWithIcon} variant={'secondary'}>
          <label>
            <Image size={'1em'} />
            {finalEmptyInputButtonText}
            <input {...restProps} accept={'image/*'} hidden onChange={onFileChange} type={'file'} />
          </label>
        </Button>
      )}
      {someImageDisplayed && (
        <div className={s.buttonWidthFix}>
          <Button onClick={handleClear} size={'fill'} variant={'secondary'}>
            {finalNonEmptyInputButtonText}
          </Button>
        </div>
      )}
    </>
  )
}
