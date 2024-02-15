import type { ImageInputContextType } from './image-input-context'
import type { Area, Point } from 'react-easy-crop'

import type { ChangeEvent, ComponentPropsWithoutRef, ElementRef, ReactElement } from 'react'
import {
  Children,
  cloneElement,
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

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { ZERO_POINT } from '@/ui/image-input/const'
import { Slider } from '@/ui/slider'
import { Typography } from '@/ui/typography'
import {
  ORIENTATION_TO_ANGLE,
  getBase64DataUrl,
  getCroppedImageDataUrl,
  getFileSizeFromUrl,
  getRotatedImageDataUrl,
} from '@/utils'
import { clsx } from 'clsx'
import { getOrientation } from 'get-orientation/browser'

import s from './image-input.module.scss'

import { ImageInputContext } from './image-input-context'

type Common = {
  centerPoint?: Point
  defaultValue?: string
  errorMessage?: string
  onClear?: () => void
  onCropCenterChange?: (params: Point) => void
  onRotationChange?: (rotation: number) => void
  onSourceImageChange?: (url: string) => void
  onValueChange?: (url: string) => void
  onZoomChange?: (zoom: number) => void
  rotationValue?: number
  zoomValue?: number
}
// not really necessary - value could be a prop while sourceImage local
type CustomComponentProps = Common &
  ({ sourceImage: string; value: string } | { sourceImage?: never; value?: never })

export type ImageInputProps = CustomComponentProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof CustomComponentProps>
const ImageInput = forwardRef<ElementRef<'input'>, ImageInputProps>((props, forwardedRef) => {
  const {
    onValueChange,
    onSourceImageChange,
    onChange,
    children,
    centerPoint,
    zoomValue,
    rotationValue,
    onRotationChange,
    onCropCenterChange,
    onZoomChange,
    errorMessage,
    defaultValue,
    sourceImage,
    value,
    onClear,
    ...restProps
  } = props

  //todo: the component must somehow resist being converted from uncontrolled to controlled
  // useEffect with [] ?
  const valueControlled = typeof value !== 'undefined' && typeof sourceImage !== 'undefined'
  // const sourceImageControlled = typeof sourceImage !== 'undefined'
  const rotationControlled = typeof rotationValue !== 'undefined'
  const zoomControlled = typeof zoomValue !== 'undefined'
  const centerPointControlled = typeof centerPoint !== 'undefined'

  // will be set to defaultValue via useEffect (fired once)
  const [localValueDataUrl, setLocalValueDataUrl] = useState<ImageInputProps['value']>('')

  const [localSourceImageDataUrl, setLocalSourceImageDataUrl] =
    useState<ImageInputProps['sourceImage']>('')

  const [localCropCenterPoint, setLocalCropCenterPoint] = useState<Point>(
    centerPoint ? centerPoint : ZERO_POINT
  )
  const [localRotation, setLocalRotation] = useState<number>(0)
  const [localZoom, setLocalZoom] = useState<number>(zoomValue || 1)

  const croppedArea = useRef<Area | null>()

  const onCropComplete = useCallback(
    async (_croppedArea: Area, newCroppedArea: Area) => {
      console.log('onCropComplete')
      if (valueControlled) {
        if (croppedArea) {
          croppedArea.current = newCroppedArea
        }
        if (!sourceImage || !croppedArea?.current) {
          return
        }

        // save new crop every time Cropper touched
        try {
          const croppedImageDataUrl = await getCroppedImageDataUrl(
            sourceImage,
            croppedArea.current,
            rotationValue
          )

          onValueChange && onValueChange(croppedImageDataUrl || '')
        } catch (e) {
          console.error(e)
        }
      }
      if (!valueControlled) {
        if (croppedArea) {
          croppedArea.current = newCroppedArea
        }
        if (!localSourceImageDataUrl || !croppedArea?.current) {
          return
        }

        // save new crop every time Cropper touched
        try {
          const croppedImageDataUrl = await getCroppedImageDataUrl(
            localSourceImageDataUrl,
            croppedArea.current,
            rotationControlled ? rotationValue : localRotation
          )

          onValueChange && onValueChange(croppedImageDataUrl || '')
        } catch (e) {
          console.error(e)
        }
      }
    },
    [
      valueControlled,
      sourceImage,
      rotationValue,
      onValueChange,
      localSourceImageDataUrl,
      rotationControlled,
      localRotation,
    ]
  )

  const handleResetCrop = useCallback(() => {
    !zoomControlled && setLocalZoom(1)
    onZoomChange && onZoomChange(1)

    !centerPointControlled && setLocalCropCenterPoint(ZERO_POINT)
    onCropCenterChange && onCropCenterChange(ZERO_POINT)

    !rotationControlled && setLocalRotation(0)
    onRotationChange && onRotationChange(0)
  }, [
    centerPointControlled,
    onCropCenterChange,
    onRotationChange,
    onZoomChange,
    rotationControlled,
    zoomControlled,
  ])

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    handleResetCrop()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!file || !file.type.includes('image')) {
        console.warn('not an image file')

        return
      }
      // !valueControlled && setLocalValueFile(file)

      const imageDataUrl = await getBase64DataUrl(file)

      try {
        const orientation = await getOrientation(file)
        const exifRotation = ORIENTATION_TO_ANGLE[orientation]

        if (exifRotation && imageDataUrl) {
          const rotatedImageDataUrl = await getRotatedImageDataUrl(imageDataUrl, exifRotation)

          if (rotatedImageDataUrl) {
            onSourceImageChange && onSourceImageChange(rotatedImageDataUrl)
            onValueChange && onValueChange(imageDataUrl) //for replacing 'IMAGE_WAS_DELETED' const

            !valueControlled && setLocalValueDataUrl(rotatedImageDataUrl)
            !valueControlled && setLocalSourceImageDataUrl(imageDataUrl)
          }

          return
        }
      } catch (e) {
        console.warn('failed to detect the orientation')
      }
      imageDataUrl && onSourceImageChange && onSourceImageChange(imageDataUrl)
      imageDataUrl && onSourceImageChange && onSourceImageChange(imageDataUrl)
      imageDataUrl && onValueChange && onValueChange(imageDataUrl)

      !valueControlled && imageDataUrl && setLocalValueDataUrl(imageDataUrl)
      !valueControlled && imageDataUrl && setLocalSourceImageDataUrl(imageDataUrl)
    }
    onChange && onChange(e)
  }

  useEffect(() => {
    console.log('effect: setting default value as value after mounting')
    if (!fileInputRef.current || valueControlled || !defaultValue) {
      return
    }
    setLocalValueDataUrl(defaultValue)
    // should be run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClear = useCallback(() => {
    console.log('handleClear', { valueControlled })
    handleResetCrop()
    if (valueControlled) {
      if (defaultValue) {
        onValueChange && onValueChange(defaultValue)
      }
      if (!defaultValue) {
        onValueChange && onValueChange('')
      }
      onSourceImageChange && onSourceImageChange('')
    }
    if (!valueControlled) {
      if (defaultValue) {
        // getFileFromUrl(defaultValue).then(file => {
        //   if (file) {
        //     const dataTransfer = new DataTransfer()
        //     dataTransfer.items.add(file)
        //     fileInputRef?.current && (fileInputRef.current.files = dataTransfer.files)
        //     setLocalValueFile(file)
        //   }
        //     })
        textInputRef?.current && (textInputRef.current.value = defaultValue)
        setLocalValueDataUrl(defaultValue)
        onValueChange && onValueChange(defaultValue)
      }
      if (!defaultValue) {
        fileInputRef?.current?.value && (fileInputRef.current.value = '')
        textInputRef?.current && (textInputRef.current.value = '')
        setLocalValueDataUrl('')
        onValueChange && onValueChange('')
      }
      setLocalSourceImageDataUrl('')
      onSourceImageChange && onSourceImageChange('')
    }
  }, [valueControlled, handleResetCrop, defaultValue, onSourceImageChange, onValueChange])

  const handleDelete = useCallback(() => {
    handleResetCrop()

    console.log('handleDelete', { valueControlled })

    if (valueControlled) {
      onValueChange && onValueChange(IMAGE_WAS_ERASED)
      onSourceImageChange && onSourceImageChange('')
    }
    if (!valueControlled) {
      fileInputRef?.current?.value && (fileInputRef.current.value = '')
      textInputRef?.current && (textInputRef.current.value = IMAGE_WAS_ERASED)
      setLocalValueDataUrl(IMAGE_WAS_ERASED)
      onValueChange && onValueChange(IMAGE_WAS_ERASED)
      onSourceImageChange && onSourceImageChange('')
      setLocalSourceImageDataUrl('')
    }
  }, [handleResetCrop, valueControlled, onValueChange, onSourceImageChange])

  // useEffect(() => {
  //   onCropCenterChange && onCropCenterChange(localCropCenterPoint)
  // }, [localCropCenterPoint, onCropCenterChange])
  //
  // useEffect(() => {
  //   onZoomChange && onZoomChange(localZoom)
  // }, [localZoom, onZoomChange])
  //
  // useEffect(() => {
  //   onRotationChange && onRotationChange(localRotation)
  // }, [localRotation, onRotationChange])

  // const fileInputRef = useCombinedRef<HTMLInputElement>(forwardedRef)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  const changeZoom = useCallback(
    (p: number) => {
      !zoomControlled && setLocalZoom(p)
      onZoomChange && onZoomChange(p)
    },
    [onZoomChange, zoomControlled]
  )

  const changeRotation = useCallback(
    (p: number) => {
      !rotationControlled && setLocalRotation(p)
      onRotationChange && onRotationChange(p)
    },
    [onRotationChange, rotationControlled]
  )

  const changeCenterPoint = useCallback(
    (p: Point) => {
      !centerPointControlled && setLocalCropCenterPoint(p)
      onCropCenterChange && onCropCenterChange(p)
    },
    [centerPointControlled, onCropCenterChange]
  )

  const contextValue: ImageInputContextType = useMemo(
    () => ({
      value: valueControlled ? value : localValueDataUrl,
      triggerImageSelection: () => fileInputRef.current?.click(),
      clearValue: handleClear,
      deleteImage: handleDelete,
      changeRotation,
      message: errorMessage,
      imageRotationValue: rotationControlled ? rotationValue : localRotation,
      zoomValue: zoomControlled ? zoomValue : localZoom,
      changeZoom,
      cropCenterPoint: centerPointControlled ? centerPoint : localCropCenterPoint,
      changeCropCenterPoint: changeCenterPoint,
      onCropComplete,
      onValueChange,
      defaultValue,
      sourceImage: valueControlled ? sourceImage : localSourceImageDataUrl,
    }),

    [
      valueControlled,
      value,
      localValueDataUrl,
      handleClear,
      handleDelete,
      changeRotation,
      errorMessage,
      rotationControlled,
      rotationValue,
      localRotation,
      zoomControlled,
      zoomValue,
      localZoom,
      changeZoom,
      centerPointControlled,
      centerPoint,
      localCropCenterPoint,
      changeCenterPoint,
      onCropComplete,
      onValueChange,
      defaultValue,
      sourceImage,
      localSourceImageDataUrl,
    ]
  )

  useImperativeHandle(forwardedRef, () => {
    console.log('useImperativeHandle')

    if (valueControlled) {
      if (
        textInputRef?.current?.value !== value ||
        (value === '' && textInputRef?.current?.value !== '')
      ) {
        if (value === '') {
          fileInputRef?.current?.value && (fileInputRef.current.value = '')
          textInputRef?.current?.value && (textInputRef.current.value = '')
        } else {
          // getFileFromUrl(value).then(file => {
          //   if (file) {
          //     const dataTransfer = new DataTransfer()
          //     dataTransfer.items.add(file)
          //     fileInputRef.current && (fileInputRef.current.files = dataTransfer.files)
          //   }
          // })
          textInputRef.current && (textInputRef.current.value = value)
        }
      }
    }

    // if (!valueControlled) {
    //   if (
    //     (fileInputRef?.current?.files?.length &&
    //       localValue?.name !== fileInputRef?.current?.files.item(0)?.name) ||
    //     (localValue?.name && !fileInputRef?.current?.files?.length) ||
    //     (localValue === null && fileInputRef?.current?.files?.length)
    //   ) {
    //     if (localValue === null || !(localValue instanceof File)) {
    //       fileInputRef?.current?.value && (fileInputRef.current.value = '')
    //     } else {
    //       const dataTransfer = new DataTransfer()
    //
    //       dataTransfer.items.add(localValue)
    //       fileInputRef.current && (fileInputRef.current.files = dataTransfer.files)
    //     }
    //   }
    // }

    return {
      ...fileInputRef.current,
      value: textInputRef.current?.value,
      defaultValue: defaultValue,
    } as HTMLInputElement
  })

  return (
    <>
      <input
        {...restProps}
        accept={'image/*'}
        hidden
        onChange={onFileChange}
        ref={fileInputRef}
        type={'file'}
      />
      <input
        {...restProps}
        hidden
        onChange={() => {}}
        ref={textInputRef}
        type={'text'}
        value={value}
      />
      <ImageInputContext.Provider value={contextValue}>{children}</ImageInputContext.Provider>
    </>
  )
})

const ImageInputTrigger = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) => {
  const child = Children.only(children)
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
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

const ImageInputClear = ({ className, children, ...props }: ComponentPropsWithoutRef<'button'>) => {
  const child = Children.only(children)
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const { clearValue } = context

  return (
    <>
      {child &&
        isValidElement(child) &&
        cloneElement(child as ReactElement, {
          ...props,
          onClick: clearValue,
        })}
    </>
  )
}

const ImageInputDelete = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) => {
  const child = Children.only(children)
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const { deleteImage } = context

  return (
    <>
      {child &&
        isValidElement(child) &&
        cloneElement(child as ReactElement, {
          ...props,
          onClick: deleteImage,
        })}
    </>
  )
}

const ImageRotationControl = ({
  max = 90,
  min = -90,
  title = 'rotation control',
  value,
  onValueChange,
  defaultValue,
  disabled,
  ...props
}: ComponentPropsWithoutRef<typeof Slider>) => {
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const {
    changeRotation,
    value: inputValue,
    imageRotationValue,
    defaultValue: inputDefaultValue,
  } = context

  const handleRotateViaSlider = (sliderValue: number[]) => {
    changeRotation && changeRotation(sliderValue[0])
  }

  const sliderDisabled =
    !inputValue || inputValue === inputDefaultValue || inputValue === IMAGE_WAS_ERASED || disabled

  return (
    <>
      <Slider
        {...props}
        disabled={sliderDisabled}
        max={max}
        min={min}
        onValueChange={handleRotateViaSlider}
        title={title}
        value={[imageRotationValue || 0]}
      />
    </>
  )
}

const ImageZoomControl = ({
  max = 5,
  min = 1,
  step = 0.01,
  title = 'zoom control',
  onValueChange,
  value,
  defaultValue,
  ...props
}: ComponentPropsWithoutRef<typeof Slider>) => {
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const { changeZoom, zoomValue, value: InputValue } = context

  const handleZoomViaSlider = (sliderValue: number[]) => {
    changeZoom && changeZoom(sliderValue[0])
  }

  const sliderDisabled = !InputValue || !InputValue[0]

  return (
    <>
      <div>
        <Typography as={'h3'} variant={'body2'}>
          zoom
        </Typography>
        <Slider
          {...props}
          disabled={sliderDisabled}
          max={max}
          min={min}
          onValueChange={handleZoomViaSlider}
          title={title}
          value={[zoomValue || 1]}
        />
      </div>
    </>
  )
}

const ImageInfo = ({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) => {
  const [cropFileSize, setCropFileSize] = useState<null | number>(null)
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const { value, message } = context

  const imageCrop = value ? value : null

  useEffect(() => {
    getFileSizeFromUrl(imageCrop).then(size => setCropFileSize(size))
  }, [imageCrop])

  const cn = {
    imageInfo: clsx(s.imageInfoContainer, className),
  }

  return (
    <>
      <div className={cn.imageInfo} {...props}>
        {message && <Typography variant={'error'}>{message}</Typography>}
        {!message && cropFileSize && (
          <Typography variant={'body2'}>{`${cropFileSize.toFixed(2)}MB`}</Typography>
        )}
      </div>
    </>
  )
}

export {
  ImageInfo,
  ImageInput,
  ImageInputClear,
  ImageInputDelete,
  ImageInputTrigger,
  ImageRotationControl,
  ImageZoomControl,
}
