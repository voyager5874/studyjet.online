import type { DeckFormData } from '@/features/decks/edit-dialog/deck-form-schema'
import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import {
  useCreateDecksMutation,
  useDeleteDeckMutation,
  useGetDeckByIdQuery,
  useGetDecksQuery,
  useUpdateDeckMutation,
} from '@/features/decks/api'
import { EditDeckDialog } from '@/features/decks/edit-dialog'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/features/decks/use-page-search-params'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/ui/button'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { getFileFromUrl } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'

import s from './page.module.scss'

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

  const { data, currentData, isFetching, isLoading } = useGetDecksQuery({
    currentPage,
    itemsPerPage,
    orderBy,
    name: useDebouncedValue(name, 1300),
  })

  const [createDeck, { isSuccess }] = useCreateDecksMutation()
  const [deleteDeck, { isLoading: isDeleting }] = useDeleteDeckMutation()
  const [updateDeck, { isLoading: isUpdating, isSuccess: updateSuccessful }] =
    useUpdateDeckMutation()

  const [selectedDeckId, setSelectedDeckId] = useState<null | string>(null)
  const { currentData: selectedDeckData } = useGetDeckByIdQuery(selectedDeckId ?? skipToken)

  const [addDeckDialogOpen, setAddDeckDialogOpen] = useState<boolean>(false)
  const [editDeckDialogOpen, setEditDeckDialogOpen] = useState<boolean>(false)

  const handleEditDeck = (id: string) => {
    setSelectedDeckId(id)
    setEditDeckDialogOpen(true)
  }

  const decksDataToDisplayInTheTable = currentData ?? data

  const handleEditDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditDeckDialogOpen(false)
      setSelectedDeckId(null)
    }
  }

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => <DeckActions deck={deck} onDelete={deleteDeck} onEdit={handleEditDeck} />,
      title: '',
    },
  ]

  const handleNewDeckDataSubmit = async (data: DeckFormData) => {
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

  const handleDeckUpdatedDataSubmit = async (data: DeckFormData) => {
    if (!selectedDeckData) {
      return
    }
    const updateDeckFormData = new FormData()

    const imageWasErased = data?.cover && data.cover[0] === IMAGE_WAS_ERASED
    const updatedImageDataUrl = !imageWasErased && data?.cover && data.cover[1]

    const nameChanged = data?.name && selectedDeckData.name !== data.name
    const isPrivateChanged = selectedDeckData.isPrivate !== data?.isPrivate

    nameChanged && updateDeckFormData.append('name', data.name)
    isPrivateChanged && updateDeckFormData.append('isPrivate', String(data.isPrivate))

    if (updatedImageDataUrl) {
      const cover = await getFileFromUrl(updatedImageDataUrl)

      updateDeckFormData.append('cover', cover)
    }
    if (imageWasErased) {
      // erase deck cover info on the server
      updateDeckFormData.append('cover', '')
    }

    setEditDeckDialogOpen(false)

    const patchData = { id: selectedDeckData.id, body: updateDeckFormData }

    updateDeck(patchData)
      .unwrap()
      .then(() => {
        alert('success')
        setSelectedDeckId(null)
      })
      .catch(() => {
        alert('error')
        setEditDeckDialogOpen(true)
      })
  }

  const changeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value) {
      handleNameSearchRaw(value)
    } else {
      handleNameSearchRaw('')
    }
  }

  const busy = isFetching || isLoading || isDeleting || isUpdating
  // todo: get rid of inline styles

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
        <EditDeckDialog
          isSuccess={isSuccess}
          onOpenChange={setAddDeckDialogOpen}
          onSubmit={handleNewDeckDataSubmit}
          open={addDeckDialogOpen}
          title={'add deck'}
          trigger={<Button>Add new deck</Button>}
        />
        {selectedDeckData && (
          <EditDeckDialog
            deck={selectedDeckData}
            isSuccess={updateSuccessful}
            onOpenChange={handleEditDialogOpenChange}
            onSubmit={handleDeckUpdatedDataSubmit}
            open={editDeckDialogOpen}
            title={'edit deck'}
          />
        )}
      </div>

      <Table
        caption={'Decks'}
        columns={columns}
        data={decksDataToDisplayInTheTable?.items || []}
        onChangeSort={handleSortChange}
        sort={tableSortProp}
      />
      {decksDataToDisplayInTheTable?.pagination && (
        <div className={s.paginationContainer}>
          <Pagination
            onPageChange={handlePageChange}
            onPerPageCountChange={handlePerPageChange}
            pagination={decksDataToDisplayInTheTable.pagination}
            perPage={itemsPerPage || 10}
          />
        </div>
      )}
    </>
  )
}
