import type { Area } from 'react-easy-crop'

import { createImageHtmlElementFromDataUrl, loadImageFromFile } from '@/utils'

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

export async function getCroppedImgUrlFromOriginalImageUrl(
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

  return await new Promise((resolve, _reject) => {
    croppedCanvas.toBlob(file => {
      if (file) {
        resolve(URL.createObjectURL(file))
      }
    }, 'image/jpeg')
  })
}

export async function getCroppedImgFileFromOriginalFileObject(
  imageFile: File,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<File | null> {
  let image = null

  try {
    image = await loadImageFromFile(imageFile)
  } catch (e) {
    console.log(e)

    return null
  }

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

  // Convert canvas to a Blob
  const blob = await new Promise<Blob | null>((resolve, _reject) => {
    croppedCanvas.toBlob(file => {
      if (file) {
        resolve(file)
      }
    }, imageFile.type)
  })

  // Create a File object with the Blob and additional properties
  if (blob) {
    return new File([blob], 'cropped_image', {
      type: blob.type,
      lastModified: Date.now(),
    })
  }

  return null
}

export async function getRotatedImageUrlFromOriginalImageUrl(
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

  return new Promise((resolve, reject) => {
    canvas.toBlob(file => {
      if (file) {
        // resolve(new URL(URL.createObjectURL(file)))
        resolve(URL.createObjectURL(file))
      } else {
        reject(new Error('Unable to create blob from the canvas'))
      }
    }, 'image/png')
  })
}

export async function getRotatedImageFileFromOriginalFileObject(
  imageFile: File,
  rotation = 0
): Promise<File | null> {
  let image = null

  try {
    image = await loadImageFromFile(imageFile)
  } catch (e) {
    console.log(e)

    return null
  }
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

  // Convert canvas to a Blob
  const blob = await new Promise<Blob | null>((resolve, _reject) => {
    canvas.toBlob(file => {
      if (file) {
        resolve(file)
      }
    }, imageFile.type)
  })

  // Create a File object with the Blob and additional properties
  if (blob) {
    return new File([blob], 'rotated_image', {
      type: blob.type,
      lastModified: Date.now(),
    })
  }

  return null
}
