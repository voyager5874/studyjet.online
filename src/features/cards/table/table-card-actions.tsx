import type { CardItem } from '@/features/cards/types'

import { useMeQuery } from '@/features/user/api'
import { Button } from '@/ui/button'
import { PenLine, Trash } from 'lucide-react'

import s from './table-card-actions.module.scss'

type Props = {
  card: CardItem
}
export function CardActions({ card }: Props) {
  const authorId = card?.userId
  const { data } = useMeQuery()
  const userId = data?.id

  return (
    <>
      {authorId === userId && (
        <div className={s.flexContainer}>
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
