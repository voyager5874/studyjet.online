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
    const image = new Image()

    image.onerror = err => {
      reject(err)
    }
    image.onload = () => resolve(image)

    image.src = url
  })

function getExtensionFromBlob(blob: Blob): null | string {
  const extensionByMimeType: { [key: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/gif': 'gif',
    'image/webp': 'webp',
  }
  const mimeType = blob.type

  return mimeType ? extensionByMimeType[mimeType] : 'jpeg'
}

// get File instance from base64 dataUrl or any other url that leads to an image
export async function getFileFromUrl(blobUrl: string): Promise<File> {
  const response = await fetch(blobUrl)
  const blob = await response.blob()

  const fileType = getExtensionFromBlob(blob)

  return new File([blob], `image.${fileType}`, { type: blob.type, lastModified: Date.now() })
}
