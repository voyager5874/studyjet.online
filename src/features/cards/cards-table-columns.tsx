import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import type { CSSProperties } from 'react'

import { Button } from '@/ui/button'
import { Grade } from '@/ui/grade'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'
import { PenLine, Trash } from 'lucide-react'

const userId = '2311111f-61b6-4168-91b1-1b2307bcf458'

export const cardsTableColumn: Column<CardItem>[] = [
  {
    key: 'question',
    sortable: true,
    title: 'Question',
  },
  {
    key: 'answer',
    sortable: true,
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
  {
    key: 'actions',
    render: card => renderCardActions(card),
    title: '',
  },
]

const flexContainer: CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'flex-end',
}

export function renderCardActions(card: CardItem) {
  // const authorId = deck?.author?.id
  const authorId = card?.userId

  return (
    <>
      {authorId === userId && (
        <div style={flexContainer}>
          <Button variant={'icon'}>
            <PenLine size={14} />
          </Button>
          <Button variant={'icon'}>
            <Trash size={14} />
          </Button>
        </div>
      )}
    </>
  )
}
