import type { CropperProps } from 'react-easy-crop'

import type { CSSProperties, ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import Cropper from 'react-easy-crop'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { useElementSize, useImageDimensions } from '@/hooks'
import {
  ImageInputContext,
  ImageInputPreviewContext,
  type ImageInputPreviewContextType,
} from '@/ui/image-input/image-input-context'
import { clsx } from 'clsx'

import s from '@/ui/image-input/image-input.module.scss'

const ImageInputValuePreview = ({
  maxZoom = 5,
  objectFit = 'cover',
  zoom,
  onZoomChange,
  image,
  rotation,
  cropShape = 'rect',
  aspect = 1,
  className,
  children,
  ...props
}: Partial<CropperProps> & { children?: ReactNode; className?: string }) => {
  const { size, ref: containerRef } = useElementSize<HTMLDivElement>()
  const context = useContext(ImageInputContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInput scope')
  }
  const {
    cropCenterPoint,
    changeCropCenterPoint,
    changeZoom,
    value,
    defaultValue,
    imageRotationValue,
    zoomValue,
    onCropComplete,
    sourceImage,
  } = context

  const currentImageDimensions = useImageDimensions(sourceImage)

  const currentImageAspect = currentImageDimensions
    ? currentImageDimensions.width / currentImageDimensions.height
    : null

  const meetsCropperAspect = currentImageAspect
    ? Math.round(currentImageAspect * 10) / 10 === Math.round(aspect * 10) / 10
    : false

  let previewContainerHeight = 'unset'

  if (cropShape === 'rect' && size?.width && aspect !== 1) {
    previewContainerHeight = `${size?.width / aspect}px`
  }
  if ((cropShape === 'round' || aspect === 1) && size?.width) {
    previewContainerHeight = `${size?.width}px`
  }

  console.log({ size, containerRef })
  const previewContainerStyle: CSSProperties = {
    height: previewContainerHeight,
  }

  const cn = {
    previewContainer: clsx(
      s.previewContainer,
      // !size?.width && s.opaque,
      cropShape === 'round' && s.round,
      className
    ),
    currentImageContainer: clsx(s.currentImageContainer, cropShape === 'round' && s.round),
    imagePlaceholderContainer: clsx(s.imagePlaceholderContainer),
    image: clsx(
      meetsCropperAspect && cropShape === 'rect' && s.image,
      cropShape === 'round' && s.image,
      cropShape !== 'round' && !meetsCropperAspect && s.freeSizedImage
    ),
  }

  const showPlaceholder = value === IMAGE_WAS_ERASED || (!defaultValue && !value)
  const showDefaultImage = Boolean(defaultValue) && !sourceImage && value !== IMAGE_WAS_ERASED

  console.log('preview render', { value })

  const contextValue: ImageInputPreviewContextType = {
    showPlaceholder,
    showDefaultImage,
    shape: cropShape,
    aspectRatio: aspect,
  }

  return (
    <div className={cn.previewContainer} ref={containerRef} style={previewContainerStyle}>
      {sourceImage && (
        <Cropper
          {...props}
          aspect={aspect}
          crop={cropCenterPoint || { x: 0, y: 0 }}
          cropShape={cropShape}
          image={sourceImage}
          maxZoom={maxZoom}
          objectFit={objectFit}
          onCropChange={changeCropCenterPoint}
          onCropComplete={onCropComplete}
          onZoomChange={changeZoom}
          rotation={imageRotationValue}
          zoom={zoomValue}
        />
      )}
      {/*{showPlaceholder && (*/}
      {/*  <div className={cn.imagePlaceholderContainer}>*/}
      {/*    <ImageDown size={'15%'} />*/}
      {/*  </div>*/}
      {/*)}*/}
      <ImageInputPreviewContext.Provider value={contextValue}>
        {children}
      </ImageInputPreviewContext.Provider>
      {defaultValue && showDefaultImage && (
        <div className={cn.currentImageContainer} style={previewContainerStyle}>
          <img alt={'current image'} className={cn.image} src={defaultValue} />
        </div>
      )}
    </div>
  )
}

ImageInputValuePreview.displayName = 'ImageInputValuePreview'

const ImageInputPlaceholder = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const context = useContext(ImageInputPreviewContext)

    if (!context) {
      throw new Error('Should be used only inside ImageInputPreview scope')
    }
    const { showPlaceholder } = context

    return (
      <div
        className={clsx(s.imagePlaceholderContainer, className, !showPlaceholder && s.hidden)}
        ref={ref}
        {...props}
      />
    )
  }
)

ImageInputPlaceholder.displayName = 'ImageInputPlaceholder'

const ImageInputDefaultValueDisplay = forwardRef<
  ElementRef<'div'>,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const context = useContext(ImageInputPreviewContext)

  if (!context) {
    throw new Error('Should be used only inside ImageInputPreview scope')
  }
  const { showDefaultImage, shape } = context

  return (
    <div
      className={clsx(
        s.currentImageContainer,
        className,
        !showDefaultImage && s.hidden,
        shape === 'round' && s.round
      )}
      ref={ref}
      {...props}
    />
  )
})

ImageInputDefaultValueDisplay.displayName = 'ImageInputDefaultValueDisplay'

// const ImageInputEditor = ({
//   maxZoom = 5,
//   objectFit = 'cover',
//   zoom,
//   onZoomChange,
//   image,
//   rotation,
//   cropShape = 'rect',
//   aspect = 1,
//   className,
//   ...props
// }: Partial<CropperProps> & { className?: string }) => {
//   const { size, ref: containerRef } = useElementSize<HTMLDivElement>()
//   const context = useContext(ImageInputContext)
//
//   if (!context) {
//     throw new Error('Should be used only inside ImageInput scope')
//   }
//   const {
//     cropCenterPointLocal,
//     changeCropCenterPoint,
//     changeZoom,
//     value,
//     defaultValue,
//     imageRotationValue,
//     zoomValue,
//     onCropComplete,
//     sourceImage,
//   } = context
//
//   let previewContainerHeight = 'unset'
//
//   if (cropShape === 'rect' && size?.width && aspect !== 1) {
//     previewContainerHeight = `${size?.width / aspect}px`
//   }
//   if ((cropShape === 'round' || aspect === 1) && size?.width) {
//     previewContainerHeight = `${size?.width}px`
//   }
//
//   const previewContainerStyle: CSSProperties = {
//     height: previewContainerHeight,
//   }
//
//   const cn = {
//     previewContainer: clsx(s.previewContainer, cropShape === 'round' && s.round, className),
//   }
//
//   console.log('editor render', { value })
//
//   return (
//     <div className={cn.previewContainer} ref={containerRef} style={previewContainerStyle}>
//       {sourceImage && (
//         <Cropper
//           {...props}
//           aspect={aspect}
//           crop={cropCenterPointLocal || { x: 0, y: 0 }}
//           cropShape={cropShape}
//           image={sourceImage}
//           maxZoom={maxZoom}
//           objectFit={objectFit}
//           onCropChange={changeCropCenterPoint}
//           onCropComplete={onCropComplete}
//           onZoomChange={changeZoom}
//           rotation={imageRotationValue}
//           zoom={zoomValue}
//         />
//       )}
//     </div>
//   )
// }

export { ImageInputDefaultValueDisplay, ImageInputPlaceholder, ImageInputValuePreview }
