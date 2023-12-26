import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { useState } from 'react'

import { useCreateDecksMutation, useGetDecksQuery } from '@/features/decks/api'
import { CreateDeckDialog } from '@/features/decks/create-dialog/create-deck-dialog'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/hooks'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { getFileFromUrl, parseNumber } from '@/utils'

export const Page = () => {
  const { pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange, sortProp } =
    usePageSearchParams()

  const { data, isFetching, isLoading } = useGetDecksQuery(pageQueryParams)
  const [createDeck] = useCreateDecksMutation()

  const [addDeckDialogOpen, setAddDeckDialogOpen] = useState<boolean>(false)

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => <DeckActions deck={deck} />,
      title: '',
    },
  ]

  const handleNewDeckDataSubmit = async (data: any) => {
    console.log('deck page -> create', data)
    const formData = new FormData()

    const image = data.cover[1] ? data.cover[1] : data.cover[0]
    const cover = await getFileFromUrl(image)

    formData.append('name', data.name)
    formData.append('cover', cover)
    formData.append('isPrivate', data.isPrivate)
    createDeck(formData)
      .unwrap()
      .then(() => {
        setAddDeckDialogOpen(false)
      })
  }

  return (
    <>
      <CreateDeckDialog
        onOpenChange={setAddDeckDialogOpen}
        onSubmit={handleNewDeckDataSubmit}
        open={addDeckDialogOpen}
        title={'add deck'}
      />
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
