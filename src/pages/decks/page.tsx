import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { useGetDecksQuery } from '@/features/decks/api'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/hooks'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { parseNumber } from '@/utils'

export const Page = () => {
  const { pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange, sortProp } =
    usePageSearchParams()

  const { data, isFetching, isLoading } = useGetDecksQuery(pageQueryParams)

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => <DeckActions deck={deck} />,
      title: '',
    },
  ]

  return (
    <>
      <Table
        caption={'Decks'}
        columns={columns}
        data={data?.items || []}
        onChangeSort={handleSortChange}
        sort={sortProp}
      />
      <div>{(isFetching || isLoading) && 'loading...'}</div>
      {data?.pagination && (
        <div style={{ padding: '50px 0' }}>
          <Pagination
            onPageChange={handlePageChange}
            onPerPageCountChange={handlePerPageChange}
            pagination={data?.pagination}
            perPage={parseNumber(pageQueryParams.itemsPerPage) || 10}
          />
        </div>
      )}
    </>
  )
}

// function isValidDeckItemOrderByKey<T extends object>(
//   orderByKey: any,
//   dataItem: T
// ): orderByKey is GetDecksQueryParams['orderBy'] {
//   if (typeof orderByKey !== 'string') {
//     return false
//   }
//   const parts = orderByKey.split('.')
//
//   if (parts.length != 2) {
//     return false
//   }
//
//   return parts[0] in dataItem
// }
