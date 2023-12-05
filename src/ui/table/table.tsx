import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { Children, createContext, forwardRef, useContext } from 'react'

import { Typography } from '@/ui/typography'
import { isReactNode } from '@/utils'
import { clsx } from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'

import s from './table.module.scss'

import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from './table-blocks'

export type Column<T extends { id: string }> = {
  /* a function to show some Component based on the data or to just transform it **/
  adapter?: (input: any) => ReactNode
  className?: string
  key: keyof T
  onClick?: (id: string, key: number | string | symbol) => void
  sortable?: boolean
  title: string
}

export type Sort<T> = {
  direction: 'asc' | 'desc'
  key: keyof T
} | null

export type TableProps<T extends { id: string }> = {
  caption?: string
  // children?: Array<ReactElement<typeof TableCell>> | ReactElement<typeof TableCell> //still any ReactElement passes
  columns: Column<T>[]
  data: T[]
  onChangeSort?: (sort: Sort<T>) => void
  setRef?: (ref: any) => void
  sort?: Sort<T>
} & ComponentPropsWithoutRef<'table'>

const RenderFunction = <T extends { id: string }>(
  props: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>
) => {
  const { caption, children, columns, data, onChangeSort, setRef, sort, ...restProps } = props

  const handleSort = (column: Column<T>) => () => {
    if (!column.sortable || !onChangeSort) {
      return
    }
    if (sort?.key !== column.key) {
      return onChangeSort({ direction: 'asc', key: column.key })
    }
    if (sort?.key === column.key && sort.direction === 'asc') {
      return onChangeSort({ direction: 'desc', key: column.key })
    }

    if (sort?.key === column.key && sort.direction === 'desc') {
      return onChangeSort(null)
    }
  }

  return (
    <TableRoot ref={ref} {...restProps}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <Typography
              as={TableHead}
              key={column.title}
              onClick={handleSort(column)}
              variant={'subtitle2'}
            >
              <div className={clsx(column.sortable && s.sortableColumnHeader)}>
                {column.title}
                {sort && getSortSign(sort, column)}
              </div>
            </Typography>
          ))}
          {Children.map(children, _ => (
            <Typography as={TableHead} />
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => (
          <TableRow key={item.id}>
            {columns.map(({ adapter, key, onClick }) => (
              <Typography
                as={TableCell}
                className={clsx(onClick && s.pointer)}
                key={key as string}
                onClick={onClick && (() => onClick(item.id, key))}
                variant={'body2'}
              >
                {getCellContent(item[key], adapter)}
              </Typography>
            ))}
            <RowContext.Provider value={{ deckId: item.id, setRef: setRef }}>
              {children}
            </RowContext.Provider>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  )
}

const Table = forwardRef(RenderFunction) as <T extends { id: string }>(
  props: TableProps<T> & { ref?: ForwardedRef<HTMLTableElement> }
) => ReturnType<typeof RenderFunction>

type RowContextType = {
  deckId: null | string
  setRef: ((ref: any) => void) | undefined
}

const RowContext = createContext<RowContextType>({ deckId: null, setRef: undefined })

const ExtraColumn = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<typeof TableCell>>(
  (props, ref) => {
    const { deckId, setRef } = useContext(RowContext)
    const handleSetRef = () => {
      setRef && setRef(deckId)
    }

    return <TableCell {...props} className={s.bodyCell} onMouseEnter={handleSetRef} ref={ref} />
  }
)

function getCellContent(rawData: any, transformer?: Column<any>['adapter']): ReactNode {
  if (transformer && (isReactNode(rawData) || typeof rawData === 'object')) {
    return transformer(rawData)
  }
  if (!transformer && isReactNode(rawData)) {
    return rawData
  }
  if (!transformer && typeof rawData === 'object') {
    return JSON.stringify(rawData)
  }

  return "the data couldn't be rendered"
}

export { ExtraColumn, Table }

function getSortSign<T extends { id: string }>(sort: Sort<T>, column: Column<T>) {
  if (!sort) {
    return null
  }
  if (sort.key === column.key) {
    if (sort.direction === 'asc') {
      return <ChevronUp size={14} />
    }
    if (sort.direction === 'desc') {
      return <ChevronDown size={14} />
    }
  }
}
