import { useEffect, useState } from 'react'

import { getImageDimensionsFromUrl } from '@/utils'

type Dimensions = {
  aspectRatio: number
  height: number
  width: number
}
export const useImageDimensions = (url: null | string | undefined) => {
  const [imageDimensions, setImageDimensions] = useState<Dimensions | null>(null)

  useEffect(() => {
    getImageDimensionsFromUrl(url).then(setImageDimensions)
  }, [url])

  return imageDimensions
}
