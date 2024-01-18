import type { ComponentPropsWithoutRef } from 'react'
import { useEffect, useState } from 'react'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'
import { clsx } from 'clsx'

import s from './aspect-ratio.module.scss'

type AspectRatioProps = {
  /** just for img alt*/
  imageDescription?: string
  ratio: number
  src: null | string
} & ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
export const AspectRatio = ({ src, imageDescription, ratio, ...restProps }: AspectRatioProps) => {
  const [imageUrl, setImageUrl] = useState<null | string>(src)
  const [ready, setReady] = useState<boolean>(false)

  const handleError = () => {
    setImageUrl(null)
    setReady(true)
  }

  const handleLoad = () => {
    setReady(true)
  }

  useEffect(() => {
    setImageUrl(src)
    setReady(false)
  }, [src])

  return (
    <div className={clsx(s.container)}>
      <AspectRatioPrimitive.Root ratio={ratio} {...restProps}>
        {imageUrl && (
          <img
            alt={imageDescription}
            className={clsx(s.image, !ready && s.hidden)}
            onError={handleError}
            onLoad={handleLoad}
            src={imageUrl}
          />
        )}
        {imageUrl && !ready && <div className={clsx(s.imagePlaceholder)}>Loading...</div>}
        {!imageUrl && <div className={clsx(s.imagePlaceholder)}>No image</div>}
      </AspectRatioPrimitive.Root>
    </div>
  )
}
