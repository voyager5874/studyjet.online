import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { useParams } from 'react-router-dom'

import { useGetCardsOfDeckQuery } from '@/features/cards/api'
import { cardsTableColumns } from '@/features/cards/table/cards-table-columns'
import { CardActions } from '@/features/cards/table/table-card-actions'
import { usePageSearchParams } from '@/hooks'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { parseNumber } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'

export const Page = () => {
  const { id } = useParams<{ id: string }>()

  const { pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange, sortProp } =
    usePageSearchParams()

  const { data, isFetching, isLoading } = useGetCardsOfDeckQuery(
    id ? { id, params: pageQueryParams ?? {} } : skipToken
  )

  const columns: Column<CardItem>[] = [
    ...cardsTableColumns,

    {
      key: 'actions',
      render: card => <CardActions card={card} />,
      title: '',
    },
  ]

  return (
    <>
      <Table
        caption={'Cards'}
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
