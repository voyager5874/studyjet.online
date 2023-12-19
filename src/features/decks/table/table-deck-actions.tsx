import type { DeckItem } from '@/features/decks/types'

import { useMeQuery } from '@/features/user/api'
import { Button } from '@/ui/button'
import { PenLine, PlayCircle, Trash } from 'lucide-react'

import s from './table-deck-actions.module.scss'

const onLearn = (id: string) => {
  alert(`onLearn called with deck id: ${id}`)
}

type Props = {
  deck: DeckItem
}

export function DeckActions({ deck }: Props) {
  const authorId = deck?.userId
  const { data } = useMeQuery()
  const userId = data?.id

  return (
    <>
      <div className={s.flexContainer}>
        <Button onClick={() => onLearn(deck.id)} variant={'icon'}>
          <PlayCircle size={14} />
        </Button>
        {authorId === userId && (
          <Button variant={'icon'}>
            <PenLine size={14} />
          </Button>
        )}
        {authorId === userId && (
          <Button variant={'icon'}>
            <Trash size={14} />
          </Button>
        )}
      </div>
    </>
  )
}
