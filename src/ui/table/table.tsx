import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import { Typography } from '@/ui/typography'
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
  onClick?: (id: string, key: number | string | symbol) => void
  title: string
} & (
  | { key: keyof T; render: (data: T) => ReactNode; sortable?: boolean }
  // | { key: keyof T; render?: never; sortable: true }
  // | { key: keyof T; render?: never; sortable?: false }
  | { key: keyof T; render?: never; sortable?: boolean }
  | { key: string; render: (data: T) => ReactNode; sortable?: false }
) //key is necessary for mapping over (key prop)

export type Sort<T> = {
  direction: 'asc' | 'desc'
  key: Omit<keyof T, 'id'>
} | null

export type TableProps<T extends { id: string }> = {
  caption?: string
  columns: Column<T>[]
  data: T[]
  onChangeSort?: (sort: Sort<T>) => void
  sort?: Sort<T>
} & ComponentPropsWithoutRef<'table'>

const RenderFunction = <T extends { id: string }>(
  props: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>
) => {
  const { caption, children, columns, data, onChangeSort, sort, ...restProps } = props

  const handleSort = (column: Column<T>) => () => {
    if (!column.sortable || !onChangeSort || !column?.key) {
      return
    }
    if (!sort || sort?.key !== column.key) {
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
          {columns.map((column, idx) => (
            <TableHead key={`${column.key as string}-${idx}`}>
              <Typography
                as={'div'}
                className={clsx(column.sortable && s.sortableColumnHeader)}
                onClick={handleSort(column)}
                variant={'subtitle2'}
              >
                {column.title}
                {sort && getSortSign(sort, column)}
              </Typography>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => (
          <TableRow key={item.id}>
            {columns.map(({ render, key, onClick }) => (
              <TableCell key={`${item.id}-${key as string}`}>
                {!render && (
                  <Typography
                    className={clsx(onClick && s.pointer)}
                    onClick={onClick && (() => onClick(item.id, key))}
                    variant={'body2'}
                  >
                    {item[key]}
                  </Typography>
                )}
                {render && render(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  )
}

const Table = forwardRef(RenderFunction) as <T extends { id: string }>(
  props: TableProps<T> & { ref?: ForwardedRef<HTMLTableElement> }
) => ReturnType<typeof RenderFunction>

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

export { Table }
