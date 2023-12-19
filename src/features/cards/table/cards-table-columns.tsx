import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { Grade } from '@/ui/grade'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'

export const cardsTableColumns: Column<CardItem>[] = [
  {
    key: 'question',
    sortable: false,
    title: 'Question',
  },
  {
    key: 'answer',
    sortable: false,
    title: 'Answer',
  },
  {
    render: card => (
      <Typography style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {getFormattedDate(card.updated)}
      </Typography>
    ),
    key: 'updated',
    title: 'Last Updated',
    sortable: true,
  },
  {
    key: 'grade',
    render: card => (
      <Typography style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {<Grade grade={card.grade} />}
      </Typography>
    ),
    sortable: true,
    title: 'Acquisition',
  },
]
