import type { DeckItem } from '@/features/decks/types'

import { useMeQuery } from '@/features/user/api'
import { Button } from '@/ui/button'
import { PenLine, PlayCircle, Trash } from 'lucide-react'

import s from './table-deck-actions.module.scss'

type Props = {
  deck: DeckItem
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onLearn?: (id: string) => void
}

export function DeckActions({ deck, onDelete, onEdit, onLearn }: Props) {
  const authorId = deck?.userId
  const { data } = useMeQuery()
  const userId = data?.id

  const handleLearn = () => {
    onLearn && onLearn(deck.id)
  }

  const handleEdit = () => {
    onEdit && onEdit(deck.id)
  }

  const handleDelete = () => {
    onDelete && onDelete(deck.id)
  }

  return (
    <>
      <div className={s.flexContainer}>
        <Button onClick={handleLearn} variant={'icon'}>
          <PlayCircle size={14} />
        </Button>
        {authorId === userId && (
          <Button onClick={handleEdit} variant={'icon'}>
            <PenLine size={14} />
          </Button>
        )}
        {authorId === userId && (
          <Button onClick={handleDelete} variant={'icon'}>
            <Trash size={14} />
          </Button>
        )}
      </div>
    </>
  )
}
