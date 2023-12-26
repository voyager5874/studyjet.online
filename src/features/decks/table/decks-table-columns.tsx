import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { DeckCover } from '@/features/decks/table/deck-cover'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'

export const decksTableColumns: Column<DeckItem>[] = [
  {
    render: deck => <DeckCover deck={deck} />,
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
