import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { DeckActions } from '@/features/decks/deck-actions'
import { TableCell } from '@/ui/table/table-blocks'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'

export const decksTableColumns: Column<DeckItem>[] = [
  {
    render: deck => (
      <Typography href={`/decks/${deck.id}`} variant={'link1'}>
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
      <Typography as={TableCell} style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {getFormattedDate(deck.updated)}
      </Typography>
    ),
    key: 'updated',
    title: 'Last Updated',
  },
  {
    key: 'author',
    onClick: (id: string, key: number | string | symbol) => {
      console.log('column click', id, key)
    },
    render: deck => (
      <Typography as={TableCell} style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {deck.author?.name}
      </Typography>
    ),
    sortable: true,
    title: 'Created by',
  },
  {
    render: deck => DeckActions(deck),
    title: '',
  },
]
