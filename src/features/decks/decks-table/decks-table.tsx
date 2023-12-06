import type { DeckItem } from '@/features/decks/types'
import type { TableProps } from '@/ui/table'

import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { Table } from '@/ui/table'

export type DecksTableProps = TableProps<DeckItem>
export const DecksTable = forwardRef(
  (props: DecksTableProps, ref: ForwardedRef<HTMLTableElement>) => {
    const { columns, data, ...restProps } = props

    return <Table columns={columns} data={data} ref={ref} {...restProps} />
  }
)

// function renderDeckActions(deck: DeckItem) {
//     // const authorId = deck?.author?.id
//     const authorId = deck?.userId
//     const userId = '0afa4517-54e8-4b13-a9a6-01fde9e42f76'
//
//     return (
//         <>
//             <TableCell>
//                 <div className={s.actions}>
//                     <Button onClick={() => onLearn(deck.id)} variant={'icon'}>
//                         <PlayCircle size={14} />
//                     </Button>
//                     <Button
//                         className={clsx(authorId !== userId && s.hidden)}
//                         onClick={() => onEdit(deck?.id)}
//                         variant={'icon'}
//                     >
//                         <PenLine size={14} />
//                     </Button>
//                     <Button
//                         className={clsx(authorId !== userId && s.hidden)}
//                         onClick={() => {
//                             onDelete(deck?.id)
//                         }}
//                         variant={'icon'}
//                     >
//                         <Trash size={14} />
//                     </Button>
//                 </div>
//             </TableCell>
//             <TableCell>
//                 <div className={s.actions}>
//                     <Button onClick={() => onLearn(deck.id)} variant={'icon'}>
//                         <PlayCircle size={14} />
//                     </Button>
//                     <Button
//                         className={clsx(authorId !== userId && s.hidden)}
//                         onClick={() => onEdit(deck?.id)}
//                         variant={'icon'}
//                     >
//                         <PenLine size={14} />
//                     </Button>
//                     <Button
//                         className={clsx(authorId !== userId && s.hidden)}
//                         onClick={() => {
//                             onDelete(deck?.id)
//                         }}
//                         variant={'icon'}
//                     >
//                         <Trash size={14} />
//                     </Button>
//                 </div>
//             </TableCell>
//         </>
//     )
// }
