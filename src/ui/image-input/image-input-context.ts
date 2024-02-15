import type { Area, Point } from 'react-easy-crop'

import { createContext } from 'react'

export type ImageInputContextType = {
  changeCropCenterPoint: (params: Point) => void
  changeRotation?: (rotation: number) => void
  changeZoom?: (zoom: number) => void
  clearValue?: () => void
  cropCenterPoint?: Point
  defaultValue?: string
  deleteImage?: () => void
  imageRotationValue?: number
  message?: string
  onCropComplete: (croppedArea: Area, newCroppedAreaPixels: Area) => Promise<void>
  onValueChange?: (value: string) => void
  sourceImage?: string
  triggerImageSelection?: () => void
  value?: string
  zoomValue?: number
} | null

const defaultContext: ImageInputContextType = null

export const ImageInputContext = createContext<ImageInputContextType>(defaultContext)

export type ImageInputPreviewContextType = {
  aspectRatio: number
  shape: 'rect' | 'round'
  showDefaultImage: boolean
  showPlaceholder: boolean
}

const defaultPreviewContext: ImageInputPreviewContextType = {
  showDefaultImage: false,
  showPlaceholder: false,
  shape: 'rect',
  aspectRatio: 1,
}

export const ImageInputPreviewContext =
  createContext<ImageInputPreviewContextType>(defaultPreviewContext)
