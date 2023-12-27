import type { CreateDeckData } from '@/features/decks/create-dialog/create-deck-form-schema'
import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { useState } from 'react'

import { useCreateDecksMutation, useGetDecksQuery } from '@/features/decks/api'
import { CreateDeckDialog } from '@/features/decks/create-dialog/create-deck-dialog'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/hooks'
import { Button } from '@/ui/button'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { getFileFromUrl, parseNumber } from '@/utils'
import { LucideAtom } from 'lucide-react'

export const Page = () => {
  const { pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange, sortProp } =
    usePageSearchParams()

  const { data, isFetching, isLoading } = useGetDecksQuery(pageQueryParams)
  const [createDeck, { isSuccess }] = useCreateDecksMutation()

  const [addDeckDialogOpen, setAddDeckDialogOpen] = useState<boolean>(false)

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => <DeckActions deck={deck} />,
      title: '',
    },
  ]

  const handleNewDeckDataSubmit = async (data: CreateDeckData) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('isPrivate', String(data.isPrivate))

    if (data?.cover) {
      const image = data?.cover && data.cover[1] ? data.cover[1] : data.cover[0]
      const cover = await getFileFromUrl(image)

      formData.append('cover', cover)
    }
    setAddDeckDialogOpen(false)

    createDeck(formData)
      .unwrap()
      .then(() => {
        alert('success')
      })
      .catch(() => {
        alert('error')
        setAddDeckDialogOpen(true)
      })
  }

  return (
    <>
      <CreateDeckDialog
        isSuccess={isSuccess}
        onOpenChange={setAddDeckDialogOpen}
        onSubmit={handleNewDeckDataSubmit}
        open={addDeckDialogOpen}
        title={'add deck'}
        trigger={
          <Button variant={'icon'}>
            <LucideAtom />
          </Button>
        }
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
