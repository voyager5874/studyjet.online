import type { CardItem } from '@/features/cards'

import { useEffect, useState } from 'react'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './card-content.module.scss'

type CardContentProps = {
  card: CardItem
  contentType: 'answer' | 'question'
}
export const CardContent = ({ card, contentType }: CardContentProps) => {
  const imageKey = contentType + 'Img'
  const image = card[imageKey as keyof CardItem] as null | string
  const [src, setSrc] = useState<null | string>(image)

  useEffect(() => {
    setSrc(image)
  }, [image])

  const handleError = () => {
    setSrc(null)
  }

  const classNames = {
    container: clsx(s.container),
    image: clsx(s.image),
  }

  return (
    <div className={classNames.container}>
      {src && (
        <img alt={'deck cover'} className={classNames.image} onError={handleError} src={src} />
      )}
      <Typography variant={'body2'}>{card[contentType]}</Typography>
    </div>
  )
}
