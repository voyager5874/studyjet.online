import type { DeckItem } from '@/features/decks'

import { Link } from 'react-router-dom'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './deck-cover.module.scss'

export const DeckCover = ({ deck }: { deck: DeckItem }) => {
  const classNames = {
    container: clsx(s.container),
    image: clsx(s.image),
  }

  return (
    <div className={classNames.container} style={{ display: 'flex', alignItems: 'center' }}>
      {deck.cover && <img alt={'deck cover'} className={classNames.image} src={deck.cover} />}
      <Typography as={Link} to={`/decks/${deck.id}/cards`} variant={'link1'}>
        {deck.name}
      </Typography>
    </div>
  )
}
