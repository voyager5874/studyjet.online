import type { DeckItem } from '@/features/decks/types'

import type { CSSProperties } from 'react'

import { useMeQuery } from '@/features/user/api'
import { Button } from '@/ui/button'
import { TableCell } from '@/ui/table/table-blocks'
import { PenLine, PlayCircle, Trash } from 'lucide-react'

const flexContainer: CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'flex-end',
}

const onLearn = (id: string) => {
  alert(`onLearn called with deck id: ${id}`)
}

export function DeckActions(deck: DeckItem) {
  const { data } = useMeQuery()
  const userId = data?.id

  const authorId = deck?.userId

  return (
    <>
      <TableCell>
        <div style={flexContainer}>
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
      </TableCell>
    </>
  )
}
