import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { Link } from 'react-router-dom'

import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'

export const decksTableColumns: Column<DeckItem>[] = [
  {
    render: deck => (
      <Typography as={Link} to={`/decks/${deck.id}/cards`} variant={'link1'}>
        {deck.name}
      </Typography>
    ),
    key: 'name',
    sortable: true,
    title: 'Name',
  },
  {
    key: 'cardsCount',
    sortable: true,
    title: 'Cards',
  },
  {
    render: deck => (
      <Typography style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {getFormattedDate(deck.updated)}
      </Typography>
    ),
    key: 'updated',
    title: 'Last Updated',
    sortable: true,
  },
  {
    key: 'author',
    render: deck => (
      <Typography style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {deck.author?.name}
      </Typography>
    ),
    sortable: false,
    title: 'Created by',
  },
]
