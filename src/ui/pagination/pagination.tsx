import { Button } from '@/ui/button'
import { Select, SelectItem } from '@/ui/select'
import { Typography } from '@/ui/typography'
import { range } from '@/utils'
import { clsx } from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import s from './pagination.module.scss'

type PaginationData = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export type PaginationProps = {
  onPageChange?: (page: number) => void
  onPerPageCountChange?: (count: number) => void
  pagination: PaginationData
  perPage: number
  perPageOptions?: number[]
}

export const Pagination = ({
  pagination,
  perPage,
  onPageChange,
  onPerPageCountChange,
  perPageOptions = [10, 20, 50, 100],
}: PaginationProps) => {
  const handlePageChange = (page: number | string) => {
    onPageChange && onPageChange(Number(page))
  }

  const incrementPage = () => {
    handlePageChange(pagination.currentPage + 1)
  }

  const decrementPage = () => {
    handlePageChange(pagination.currentPage - 1)
  }
  const handlePerPageCountChange = (count: string) => {
    onPerPageCountChange && onPerPageCountChange(Number(count))
  }

  return (
    <div className={s.container}>
      <Button disabled={pagination.currentPage === 1} onClick={decrementPage} variant={'icon'}>
        <ChevronLeft size={16} />
      </Button>
      {getPagesButtons(pagination).map((item, idx) => (
        <Button
          className={clsx(s.pageButton, pagination.currentPage === item && s.current)}
          disabled={item === DOTS || item === pagination.currentPage}
          key={idx}
          onClick={() => handlePageChange(item)}
          variant={'icon'}
        >
          <span className={clsx(item === DOTS && s.dots)}>{item}</span>
        </Button>
      ))}
      <Button
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={incrementPage}
        variant={'icon'}
      >
        <ChevronRight size={16} />
      </Button>
      <Typography as={'span'} variant={'body2'}>
        Показать
      </Typography>
      <Select dense onValueChange={handlePerPageCountChange} value={String(perPage)}>
        {perPageOptions.map(item => (
          <SelectItem key={item} value={String(item)}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Typography as={'span'} variant={'body2'}>
        на странице
      </Typography>
    </div>
  )
}

const DOTS = '...'
const BUTTONS_COUNT = 7
const CURSOR_LENGTH = 3 // it is better to use odd numbers

function getPagesButtons(data: PaginationData) {
  const { currentPage, totalPages } = data

  if (totalPages <= BUTTONS_COUNT || CURSOR_LENGTH >= BUTTONS_COUNT) {
    return range(1, totalPages)
  }

  let cursorHalf = (CURSOR_LENGTH - 1) / 2

  if (CURSOR_LENGTH % 2 === 0) {
    cursorHalf = CURSOR_LENGTH / 2
  }
  const cursor = range(currentPage - cursorHalf, currentPage + cursorHalf)

  if (cursor[0] <= 1 + cursorHalf) {
    return [...range(1, BUTTONS_COUNT - 2), DOTS, totalPages]
  }

  if (cursor[cursor.length - 1] >= totalPages - cursorHalf) {
    return [1, DOTS, ...range(totalPages - (BUTTONS_COUNT - 3), totalPages)]
  }

  return [1, DOTS, ...cursor, DOTS, totalPages]
}
