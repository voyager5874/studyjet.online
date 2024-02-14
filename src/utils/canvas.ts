import type { Area } from 'react-easy-crop'

import { createImageHtmlElementFromDataUrl } from './image-files'

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
  }
}

export async function getCroppedImageDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<null | string> {
  const image = await createImageHtmlElementFromDataUrl(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { height: bBoxHeight, width: bBoxWidth } = rotateSize(image.width, image.height, rotation)

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')

  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  const dataType = ''

  // if (imageSrc.includes('base64')) {
  //   const start = imageSrc.indexOf(':image')
  //   const end = imageSrc.indexOf(':base64')
  //
  //   dataType = imageSrc.substring(start, end)
  // }

  // default of the method is png
  return croppedCanvas.toDataURL(dataType ? dataType : 'image/webp')
}

export async function getRotatedImageDataUrl(
  imageSrc: string,
  rotation = 0
): Promise<null | string> {
  const image = await createImageHtmlElementFromDataUrl(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const orientationChanged =
    rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270

  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }
  if (ctx) {
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)
  }

  return canvas.toDataURL('image/webp')
}

export const ORIENTATION_TO_ANGLE: { [key: string]: number } = {
  '3': 180,
  '6': 90,
  '8': -90,
} as const
