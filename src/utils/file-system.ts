export function getFileUrl(data: Blob | File | URL | null | string | undefined) {
  if (!data) {
    return null
  }
  if (typeof data === 'string' && data.includes('http')) {
    console.log('getFileUrl string', { url: data })

    return data
  }
  if (data instanceof URL) {
    console.log('getImageUrl URL', { url: data.href })

    return data.href
  }
  if (data instanceof File && data.type.includes('image')) {
    const url = URL.createObjectURL(data)

    console.log('getImageUrl file', { url })

    return url
  }
  if (data instanceof Blob && data.type.includes('image')) {
    const url = URL.createObjectURL(data)

    console.log('getImageUrl file', { url })

    return url
  }
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

// function readFile(file: File): Promise<ArrayBuffer | null | string> {
//   console.log('readFile')
//
//   return new Promise(resolve => {
//     const reader = new FileReader()
//
//     reader.addEventListener('load', () => resolve(reader.result), false)
//     reader.readAsDataURL(file)
//   })
// }

export const createImageHtmlElementFromDataUrl = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()

    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.src = url
  })
