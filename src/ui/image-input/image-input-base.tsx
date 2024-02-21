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
  getFileFromUrl,
  getFileSizeFromUrl,
  getRotatedImageDataUrl,
  removeFileExtension,
} from '@/utils'
import { clsx } from 'clsx'
import { getOrientation } from 'get-orientation/browser'

import s from './image-input.module.scss'

import { ImageInputContext } from './image-input-context'

type Common = {
  centerPoint?: Point
  defaultValue?: string
  errorMessage?: string
  fileName?: string
  initialContent?: string
  onClear?: () => void
  onCropCenterChange?: (params: Point) => void
  onRotationChange?: (rotation: number) => void
  onSourceImageChange?: (url: string) => void
  onValueChange?: (url: string) => void
  onZoomChange?: (zoom: number) => void
  rotationValue?: number
  zoomValue?: number
}
type CustomComponentProps = Common &
  ({ sourceImage: string; value: string } | { sourceImage?: never; value?: never })

export type ImageInputProps = CustomComponentProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof CustomComponentProps>

export type ImageInputRef = Omit<ElementRef<'input'>, keyof ImageInputProps> & {
  fileInput: HTMLInputElement
  fileName?: string
  initialContent?: string
  textInput: HTMLInputElement
  value?: string
}

const ImageInput = forwardRef<ImageInputRef, ImageInputProps>((props, forwardedRef) => {
  const {
    fileName,
    defaultValue,
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
    initialContent,
    sourceImage,
    value,
    onClear,
    list,
    ...restProps
  } = props

  const [valueControlled] = useState(
    typeof value !== 'undefined' && typeof sourceImage !== 'undefined'
  )
  const rotationControlled = typeof rotationValue !== 'undefined'
  const zoomControlled = typeof zoomValue !== 'undefined'
  const centerPointControlled = typeof centerPoint !== 'undefined'

  if (valueControlled && typeof defaultValue !== 'undefined') {
    // native input prints such warning
    console.warn('Either `defaultValue` or `value` must be defined')
  }

  if (!valueControlled && (typeof value !== 'undefined' || typeof sourceImage !== 'undefined')) {
    // native input prints such warning
    console.warn("You shouldn't convert from uncontrolled to controlled")
  }

  // can I just use the input instead of this useState?
  const [localValueDataUrl, setLocalValueDataUrl] = useState<string>('')
  const [localValueFile, setLocalValueFile] = useState<File | null>(null)

  const [localSourceImageDataUrl, setLocalSourceImageDataUrl] =
    useState<ImageInputProps['sourceImage']>('')

  const [localCropCenterPoint, setLocalCropCenterPoint] = useState<Point>(ZERO_POINT)
  const [localRotation, setLocalRotation] = useState<number>(0)
  const [localZoom, setLocalZoom] = useState<number>(zoomValue || 1)

  const croppedArea = useRef<Area | null>()

  const onCropComplete = useCallback(
    async (_croppedArea: Area, newCroppedArea: Area) => {
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

          croppedImageDataUrl && setLocalValueDataUrl(croppedImageDataUrl)
          croppedImageDataUrl && onValueChange && onValueChange(croppedImageDataUrl)
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
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!file || !file.type.includes('image')) {
        console.warn('not an image file')

        return
      }
      setLocalValueFile(file)

      const imageDataUrl = await getBase64DataUrl(file)

      try {
        const orientation = await getOrientation(file)
        const exifRotation = ORIENTATION_TO_ANGLE[orientation]

        if (exifRotation && imageDataUrl) {
          const rotatedImageDataUrl = await getRotatedImageDataUrl(imageDataUrl, exifRotation)

          if (rotatedImageDataUrl) {
            onSourceImageChange && onSourceImageChange(rotatedImageDataUrl)
            onValueChange && onValueChange(imageDataUrl) //for replacing 'IMAGE_WAS_ERASED'

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
    handleResetCrop()
  }

  useEffect(() => {
    // handleReset sets value === initialContent, this is not consistent with the below
    // if (!textInputRef.current || valueControlled || !initialContent) {
    //   return
    // }
    if (!textInputRef.current || !initialContent) {
      return
    }
    textInputRef.current.value = initialContent
    setLocalValueDataUrl(initialContent)
    onValueChange && onValueChange(initialContent)
    // should be run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleResetValue = useCallback(() => {
    if (valueControlled) {
      if (initialContent) {
        onValueChange && onValueChange(initialContent)
      }
      if (!initialContent) {
        onValueChange && onValueChange('')
      }
      onSourceImageChange && onSourceImageChange('')
    }
    if (!valueControlled) {
      if (initialContent) {
        setLocalValueDataUrl(initialContent)
        onValueChange && onValueChange(initialContent)
      }
      if (!initialContent) {
        setLocalValueDataUrl('')
        onValueChange && onValueChange('')
      }
      setLocalSourceImageDataUrl('')
      onSourceImageChange && onSourceImageChange('')
    }
    handleResetCrop()
  }, [valueControlled, handleResetCrop, initialContent, onSourceImageChange, onValueChange])

  const handleDelete = useCallback(() => {
    if (valueControlled) {
      onValueChange && onValueChange(IMAGE_WAS_ERASED)
      onSourceImageChange && onSourceImageChange('')
    }
    if (!valueControlled) {
      textInputRef?.current && (textInputRef.current.value = IMAGE_WAS_ERASED)
      setLocalValueDataUrl(IMAGE_WAS_ERASED)
      onValueChange && onValueChange(IMAGE_WAS_ERASED)
      onSourceImageChange && onSourceImageChange('')
      setLocalSourceImageDataUrl('')
    }
    handleResetCrop()
  }, [handleResetCrop, valueControlled, onValueChange, onSourceImageChange])

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
      // value: valueControlled ? value : textInputRef?.current?.value,
      triggerImageSelection: () => fileInputRef.current?.click(),
      resetValue: handleResetValue,
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
      initialContent,
      sourceImage: valueControlled ? sourceImage : localSourceImageDataUrl,
    }),

    [
      valueControlled,
      value,
      localValueDataUrl,
      handleResetValue,
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
      initialContent,
      sourceImage,
      localSourceImageDataUrl,
    ]
  )

  useImperativeHandle(forwardedRef, () => {
    if (valueControlled) {
      //passing value to the input type=text probably is enough

      // input type=file item(0) will be used for keeping sourceImage
      // manually setting file to FileList is relevant only if url (value) created outside of the component -
      // the input type=file will update itself if it was clicked

      // due to async getFileFromUrl, FileList (fileInputRef.files) will be updated some time after return
      // of this function, so useState is to run this hook again
      if (fileInputRef?.current && sourceImage && sourceImage.startsWith('data:image')) {
        const currentFileInInput = fileInputRef?.current?.files?.item(0)
        const currentFileNameInInput = currentFileInInput ? currentFileInInput.name : null
        const dataStartIndex = sourceImage.indexOf('base64')
        const sourceImageNameString =
          fileName || sourceImage.substring(dataStartIndex + 5, dataStartIndex + 5 + 20)

        if (
          !currentFileNameInInput ||
          (currentFileNameInInput && currentFileNameInInput !== sourceImageNameString)
        ) {
          getFileFromUrl(sourceImage, sourceImageNameString).then(file => {
            if (file) {
              const dataTransfer = new DataTransfer()

              dataTransfer.items.add(file)
              fileInputRef.current && (fileInputRef.current.files = dataTransfer.files)
              if (
                !localValueFile ||
                (localValueFile &&
                  removeFileExtension(localValueFile.name) !== sourceImageNameString)
              ) {
                // re-render and trigger this hook again to update ref content
                setLocalValueFile(file)
              }
            }
          })
        }
      }

      if (value && textInputRef?.current && textInputRef.current.value !== value) {
        textInputRef.current.value = value
      }
      if (value === '') {
        fileInputRef?.current && (fileInputRef.current.value = '')
        !initialContent && textInputRef?.current && (textInputRef.current.value = '')
        initialContent && textInputRef?.current && (textInputRef.current.value = initialContent)
      }
      if (value === IMAGE_WAS_ERASED) {
        fileInputRef?.current && (fileInputRef.current.value = '')
        !initialContent && textInputRef?.current && (textInputRef.current.value = value)
      }
    }
    // just update ref in onCropComplete and onFileChange?
    if (!valueControlled && textInputRef?.current) {
      if (textInputRef?.current?.value && localValueDataUrl !== textInputRef.current.value) {
        textInputRef.current.value = localValueDataUrl
      }
    }

    // const fullFileInputRefContent = getRefContentFullCopy(fileInputRef)

    return {
      // ...fullFileInputRefContent,
      ...fileInputRef.current, //content of the ref is not fully visible in a parent
      fileInput: fileInputRef.current,
      textInput: textInputRef.current,
      value: textInputRef.current?.value,
      defaultValue: textInputRef.current?.defaultValue,
      files: fileInputRef.current?.files,
      initialContent: initialContent,
      fileName: fileName || localValueFile?.name,
      sourceImage: sourceImage,
    } as ImageInputRef
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
        defaultValue={defaultValue}
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
  const { resetValue, value, initialContent } = context

  const disabled = !value || value === initialContent

  return (
    <>
      {child &&
        isValidElement(child) &&
        cloneElement(child as ReactElement, {
          ...props,
          onClick: resetValue,
          disabled,
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
  const { deleteImage, value, initialContent } = context

  const disabled = (!initialContent && !value) || (value && value === IMAGE_WAS_ERASED)

  return (
    <>
      {child &&
        isValidElement(child) &&
        cloneElement(child as ReactElement, {
          ...props,
          onClick: deleteImage,
          disabled,
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
    initialContent: inputDefaultValue,
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

const ImageInputInfo = ({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) => {
  const [cropFileSize, setCropFileSize] = useState<null | number>(null)
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const { value, message } = context

  const imageCrop = value && value.startsWith('data:image') ? value : null

  useEffect(() => {
    if (!imageCrop) {
      return
    }
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
  ImageInput,
  ImageInputClear,
  ImageInputDelete,
  ImageInputInfo,
  ImageInputTrigger,
  ImageRotationControl,
  ImageZoomControl,
}
