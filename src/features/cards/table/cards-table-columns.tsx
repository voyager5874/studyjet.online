import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { CardContent } from '@/features/cards/table/card-content'
import { Rating } from '@/ui/rating'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'

export const cardsTableColumns: Column<CardItem>[] = [
  {
    key: 'question',
    sortable: false,
    title: 'Question',
    render: card => <CardContent card={card} contentType={'question'} />,
  },
  {
    key: 'answer',
    sortable: false,
    title: 'Answer',
    render: card => <CardContent card={card} contentType={'answer'} />,
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
        {<Rating rating={card.grade} />}
      </Typography>
    ),
    sortable: true,
    title: 'Acquisition',
  },
]
