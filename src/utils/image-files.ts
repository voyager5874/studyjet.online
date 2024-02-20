import { BYTES_IN_MB } from '@/common/const/file-size-units'
import mime from 'mime'

export function createObjectUrl(data: Blob | File | null, previousUrl?: string) {
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl)
  }
  if (data && data.type.includes('image')) {
    return URL.createObjectURL(data)
  }

  return null
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      const img = new Image()

      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target?.result as string
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// File to DataURL
export async function getBase64DataUrl(file: Blob | File): Promise<null | string> {
  const reader = new FileReader()

  reader.readAsDataURL(file)
  await new Promise<void>((resolve, reject) => {
    reader.onload = () => {
      resolve()
    }
    reader.onerror = () => {
      reject()
    }
  })

  return reader.result as null | string
}

export const createImageHtmlElementFromDataUrl = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    // if (!url.includes('base64')) {
    //   reject('use base64 dataUrl of a local image')
    // }
    const image = new Image()

    image.onerror = err => {
      reject(err)
    }
    image.onload = () => resolve(image)

    image.src = url
  })

function getExtensionFromBlob(blob: Blob): null | string {
  const mimeType = blob.type

  return mime.getExtension(mimeType)
}

// get File instance from base64 dataUrl or any other url that leads to an image
export async function getFileFromUrl(blobUrl: string, name = 'image'): Promise<File | null> {
  let blob = null

  try {
    const response = await fetch(blobUrl)

    blob = await response.blob()
  } catch (err) {
    console.warn(err)
  }

  const fileType = blob ? getExtensionFromBlob(blob) : 'unknown'

  return blob
    ? new File([blob], `${name}.${fileType}`, { type: blob.type, lastModified: Date.now() })
    : null
}

export async function getFileSizeFromUrl(dataUrl: null | string) {
  if (!dataUrl) {
    return null
  }
  const file = await getFileFromUrl(dataUrl)

  if (file) {
    return file.size / BYTES_IN_MB
  }

  return null
}

export async function getImageDimensionsFromUrl(url: null | string | undefined) {
  if (!url) {
    return null
  }
  const image = await createImageHtmlElementFromDataUrl(url)

  if (image) {
    const height = image.height
    const width = image.width
    const aspectRatio = Math.round((width / height) * 10) / 10

    return { height, width, aspectRatio }
  }

  return null
}

export function blobToString(file: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      if (e.target && typeof e.target.result === 'string') {
        resolve(e.target.result)
      }
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function removeFileExtension(str: string) {
  const dotIndex = str.lastIndexOf('.')

  return dotIndex > -1 ? str.substring(0, dotIndex) : str
}
