import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef, useEffect, useState } from 'react'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'
import { clsx } from 'clsx'

import s from './aspect-ratio.module.scss'

type AspectRatioProps = {
  /** just for img alt*/
  imageDescription?: string
  ratio: number
  shape?: 'rect' | 'round'
  src: null | string
} & ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
export const AspectRatio = forwardRef<ElementRef<'img'>, AspectRatioProps>(
  ({ src, imageDescription, ratio, shape = 'rect', ...restProps }, forwardedRef) => {
    const [imageUrl, setImageUrl] = useState<null | string>(src)
    const [ready, setReady] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const handleError = () => {
      setImageUrl(null)
      setError(true)
      setReady(true)
    }

    const handleLoad = () => {
      setReady(true)
    }

    useEffect(() => {
      setImageUrl(src)
      setReady(false)
      setError(false)
    }, [src])

    return (
      <div className={clsx(s.container, shape === 'round' && s.round)}>
        <AspectRatioPrimitive.Root ratio={ratio} {...restProps}>
          <img
            alt={imageDescription}
            className={clsx(s.image, (!ready || error || !imageUrl) && s.hidden)}
            onError={handleError}
            onLoad={handleLoad}
            ref={forwardedRef}
            src={imageUrl || '/'}
          />
          {imageUrl && !ready && <div className={clsx(s.imagePlaceholder)}>Loading...</div>}
          {imageUrl && error && ready && (
            <div className={clsx(s.imagePlaceholder)}>Error loading the image!</div>
          )}
          {!imageUrl && <div className={clsx(s.imagePlaceholder)}>No valid url</div>}
        </AspectRatioPrimitive.Root>
      </div>
    )
  }
)
