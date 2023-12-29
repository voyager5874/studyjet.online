import type { CreateDeckData } from '@/features/decks/create-dialog/create-deck-form-schema'
import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import type { ChangeEvent } from 'react'
import { useState } from 'react'

import {
  useCreateDecksMutation,
  useDeleteDeckMutation,
  useGetDecksQuery,
} from '@/features/decks/api'
import { CreateDeckDialog } from '@/features/decks/create-dialog/create-deck-dialog'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/features/decks/use-page-search-params'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { getFileFromUrl } from '@/utils'

export const Page = () => {
  const {
    handleNameSearchRaw,
    handleSortChange,
    tableSortProp,
    currentPage,
    itemsPerPage,
    handlePerPageChange,
    handlePageChange,
    orderBy,
    name,
  } = usePageSearchParams()

  const { data, isFetching, isLoading } = useGetDecksQuery({
    currentPage,
    itemsPerPage,
    orderBy,
    name: useDebouncedValue(name, 1300),
  })
  const [createDeck, { isSuccess }] = useCreateDecksMutation()
  const [deleteDeck, { isLoading: isDeleting }] = useDeleteDeckMutation()

  const [addDeckDialogOpen, setAddDeckDialogOpen] = useState<boolean>(false)

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => <DeckActions deck={deck} onDelete={deleteDeck} />,
      title: '',
    },
  ]

  const handleNewDeckDataSubmit = async (data: CreateDeckData) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('isPrivate', String(data.isPrivate))

    const imageDataUrl = (data?.cover && data.cover[1]) || null

    if (imageDataUrl) {
      const cover = await getFileFromUrl(imageDataUrl)

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

  const changeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value) {
      handleNameSearchRaw(value)
    }
  }

  const busy = isFetching || isLoading || isDeleting

  return (
    <>
      <div>{busy && 'working...'}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '50%' }}>
          <TextField
            onChange={changeSearchString}
            onClear={() => handleNameSearchRaw('')}
            type={'search'}
            value={name || ''}
          />
        </div>
        <CreateDeckDialog
          isSuccess={isSuccess}
          onOpenChange={setAddDeckDialogOpen}
          onSubmit={handleNewDeckDataSubmit}
          open={addDeckDialogOpen}
          title={'add deck'}
        />
      </div>

      <Table
        caption={'Decks'}
        columns={columns}
        data={data?.items || []}
        onChangeSort={handleSortChange}
        sort={tableSortProp}
      />
      {data?.pagination && (
        <div style={{ padding: '50px 0' }}>
          <Pagination
            onPageChange={handlePageChange}
            onPerPageCountChange={handlePerPageChange}
            pagination={data?.pagination}
            perPage={itemsPerPage || 10}
          />
        </div>
      )}
    </>
  )
}
