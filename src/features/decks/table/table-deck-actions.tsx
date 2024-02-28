import type { DeckItem } from '@/features/decks/types'

import { useMeQuery } from '@/features/user/api'
import { useLocalStorage } from '@/hooks'
import { Button } from '@/ui/button'
import { LucideBookmark, LucideBookmarkX, PenLine, PlayCircle, Trash } from 'lucide-react'

import s from './table-deck-actions.module.scss'

type Props = {
  deck: DeckItem //count and id ? or pass whole deck to callbacks -> less network calls
  onDelete?: (id: string) => void
  onDeleteFromFavorites?: (id: string) => void
  onEdit?: (id: string) => void
  onLearn?: (id: string) => void
}

export function DeckActions({ deck, onDelete, onEdit, onLearn, onDeleteFromFavorites }: Props) {
  const authorId = deck?.userId
  const { data } = useMeQuery() // via props?
  const [favoriteDecksIds, setFavoriteDecks] = useLocalStorage('favorites')

  const userId = data?.id || 'n/a'

  const handleLearn = () => {
    onLearn && onLearn(deck.id)
  }

  const handleEdit = () => {
    onEdit && onEdit(deck.id)
  }

  const handleDelete = () => {
    onDelete && onDelete(deck.id)
  }

  const addToFavorites = () => {
    setFavoriteDecks([...favoriteDecksIds, deck.id])
  }

  const removeFromFavorites = () => {
    if (!favoriteDecksIds || !favoriteDecksIds?.length) {
      return
    }
    !onDeleteFromFavorites &&
      setFavoriteDecks(favoriteDecksIds.filter((id: string) => id !== deck.id))
    onDeleteFromFavorites && onDeleteFromFavorites(deck.id)
  }

  return (
    <>
      <div className={s.flexContainer}>
        {favoriteDecksIds.includes(deck.id) ? (
          <Button onClick={removeFromFavorites} variant={'icon'}>
            <LucideBookmarkX size={14} />
          </Button>
        ) : (
          <Button onClick={addToFavorites} variant={'icon'}>
            <LucideBookmark size={14} />
          </Button>
        )}
        <Button disabled={deck.cardsCount === 0} onClick={handleLearn} variant={'icon'}>
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
