import type { DeckItem } from '@/features/decks'

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './deck-cover.module.scss'

export const DeckCover = ({ deck }: { deck: DeckItem }) => {
  const { state, pathname } = useLocation()

  const cover = deck?.cover
  const [src, setSrc] = useState<null | string>(cover)

  const handleError = () => {
    setSrc(null)
  }

  useEffect(() => {
    setSrc(cover)
  }, [cover])

  const classNames = {
    container: clsx(s.container, s.link),
    image: clsx(s.image),
  }
  // todo: use some placeholder if there is no cover / maybe two different: for error and actual null

  return (
    <Link
      className={classNames.container}
      state={{ ...state, cardsPageReferer: `${pathname}` }}
      to={`/decks/${deck.id}/cards`}
    >
      {src && (
        <img alt={'deck cover'} className={classNames.image} onError={handleError} src={src} />
      )}
      <Typography variant={'body2'}>{deck.name}</Typography>
    </Link>
  )
}
