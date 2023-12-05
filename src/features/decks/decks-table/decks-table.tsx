import type { DeckItem } from '@/features/decks/types'
import type { TableProps } from '@/ui/table'

import type { ForwardedRef } from 'react'
import { forwardRef, useRef } from 'react'

import { useDebouncedFunction } from '@/hooks/useDebouncedFunction'
import { Button } from '@/ui/button'
import { ExtraColumn, Table } from '@/ui/table'
import { PenLine, PlayCircle, Trash } from 'lucide-react'

import s from './decks-table.module.scss'

export type DecksTableProps = {
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onLearn(id: string): void
} & TableProps<DeckItem>
export const DecksTable = forwardRef(
  (props: DecksTableProps, ref: ForwardedRef<HTMLTableElement>) => {
    const { columns, data, onDelete, onEdit, onLearn, ...restProps } = props
    const rowRef = useRef<null | string>(null)

    const handleLearnStart = () => {
      rowRef?.current && onLearn(rowRef?.current)
    }

    const handleEditStart = () => {
      rowRef?.current && onEdit(rowRef?.current)
    }

    const handleDeleteStart = () => {
      rowRef?.current && onDelete(rowRef?.current)
    }

    const setRef = (id: string) => {
      rowRef.current = id
    }

    const debouncedSetRef = useDebouncedFunction(setRef, 200)

    return (
      <Table columns={columns} data={data} ref={ref} {...restProps} setRef={debouncedSetRef}>
        <ExtraColumn>
          <div className={s.actions}>
            <Button onClick={handleLearnStart} variant={'icon'}>
              <PlayCircle size={14} />
            </Button>
            <Button onClick={handleEditStart} variant={'icon'}>
              <PenLine size={14} />
            </Button>
            <Button onClick={handleDeleteStart} variant={'icon'}>
              <Trash size={14} />
            </Button>
          </div>
        </ExtraColumn>
      </Table>
    )
  }
)
