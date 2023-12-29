import type { DeckItem } from '@/features/decks'

import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './deck-cover.module.scss'

export const DeckCover = ({ deck }: { deck: DeckItem }) => {
  const [src, setSrc] = useState<null | string>(deck.cover)

  const handleError = () => {
    setSrc(null)
  }

  const classNames = {
    container: clsx(s.container),
    image: clsx(s.image),
  }
  // todo: use some placeholder if there is no cover / maybe two different: for error and actual null

  return (
    <div className={classNames.container} style={{ display: 'flex', alignItems: 'center' }}>
      {src && (
        <img alt={'deck cover'} className={classNames.image} onError={handleError} src={src} />
      )}
      <Typography as={Link} to={`/decks/${deck.id}/cards`} variant={'link1'}>
        {deck.name}
      </Typography>
    </div>
  )
}
