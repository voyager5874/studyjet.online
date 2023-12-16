import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { clsx } from 'clsx'

import s from './table-blocks.module.scss'

const TableRoot = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className={''}>
      <table className={clsx(s.root, className)} ref={ref} {...props} />
    </div>
  )
)

TableRoot.displayName = 'Table'

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead className={clsx(s.header, s.row, className)} ref={ref} {...props} />
  )
)

TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody className={clsx(className)} ref={ref} {...props} />
)

TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tfoot className={clsx(className)} ref={ref} {...props} />
)

TableFooter.displayName = 'TableFooter'

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr className={clsx(s.row, className)} ref={ref} {...props} />
)

TableRow.displayName = 'TableRow'

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th className={clsx(s.cell, s.headerCell, className)} ref={ref} {...props} />
  )
)

TableHead.displayName = 'TableHead'

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td className={clsx(s.cell, s.bodyCell, className)} ref={ref} {...props} />
  )
)

TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption className={clsx(className)} ref={ref} {...props} />
)

TableCaption.displayName = 'TableCaption'

export {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
}
