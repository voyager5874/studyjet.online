import type { DeckFormData } from '@/features/decks/edit-dialog/deck-form-schema'
import type { LearnDeckFormData } from '@/features/decks/learn-dialog/learn-deck-form-schema'
import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'
import type { CheckedState } from '@radix-ui/react-checkbox'

import type { ChangeEvent } from 'react'
import { useCallback, useRef, useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { useGetRandomCardFromDeckQuery, useRateCardAcquisitionMutation } from '@/features/cards/api'
import {
  useCreateDecksMutation,
  useDeleteDeckMutation,
  useGetDeckByIdQuery,
  useGetDecksQuery,
  useUpdateDeckMutation,
} from '@/features/decks/api'
import { DeleteDeckDialog } from '@/features/decks/delete-dialog'
import { EditDeckDialog } from '@/features/decks/edit-dialog'
import { LearnDeckDialog } from '@/features/decks/learn-dialog'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/features/decks/use-page-search-params'
import { useMeQuery } from '@/features/user/api'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Pagination } from '@/ui/pagination'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Slider } from '@/ui/slider'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { getFileFromUrl } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const {
    handleNameSearch,
    handleSortChange,
    tableSortProp,
    currentPage,
    itemsPerPage,
    handlePerPageChange,
    handlePageChange,
    handleDecksByAuthorIdSearch,
    authorId,
    orderBy,
    maxCardsCount,
    minCardsCount,
    handleItemsMinCountChange,
    handleItemsMaxCountChange,
    handleResetAllQueries,

    name,
  } = usePageSearchParams()

  const { data, currentData, isFetching, isLoading } = useGetDecksQuery({
    currentPage,
    itemsPerPage,
    orderBy,
    authorId,
    maxCardsCount: useDebouncedValue(maxCardsCount, 1300),
    minCardsCount: useDebouncedValue(minCardsCount, 1300),
    name: useDebouncedValue(name, 1300),
  })
  const decksDataForTable = currentData ?? data

  const { data: currentUser } = useMeQuery()

  const [createDeck, { isSuccess, isLoading: deckIsBeingCreated }] = useCreateDecksMutation()
  const [deleteDeck, { isLoading: isDeleting }] = useDeleteDeckMutation()
  const [updateDeck, { isLoading: isUpdating, isSuccess: updateSuccessful }] =
    useUpdateDeckMutation()
  const [rateCardAcquisition, { isSuccess: cardGradeSubmitSuccessful }] =
    useRateCardAcquisitionMutation()

  const selectedDeckId = useRef<null | string>(null)

  const setSelectedDeckId = (id: null | string) => {
    selectedDeckId.current = id
  }

  const previousSelectedDeckId = useRef<null | string>(null)

  const setPreviousSelectedDeckId = (id: null | string) => {
    previousSelectedDeckId.current = id
  }

  const { currentData: selectedDeckData, isFetching: selectedDeckIsFetching } = useGetDeckByIdQuery(
    selectedDeckId?.current ?? skipToken
  )

  const {
    currentData: cardToLearnData,
    refetch: fetchNewCardToLearn,
    isFetching: cardToLearnFetching,
  } = useGetRandomCardFromDeckQuery(
    selectedDeckId?.current
      ? {
          deckId: selectedDeckId?.current,
          ...(previousSelectedDeckId.current && {
            previousCardId: previousSelectedDeckId.current,
          }),
        }
      : skipToken
  )

  const [addDeckDialogOpen, setAddDeckDialogOpen] = useState<boolean>(false)
  const [editDeckDialogOpen, setEditDeckDialogOpen] = useState<boolean>(false)
  const [deleteDeckDialogOpen, setDeleteDeckDialogOpen] = useState<boolean>(false)
  const [learnDialogOpen, setLearnDialogOpen] = useState<boolean>(false)

  const prepareEdit = useCallback((id: string) => {
    setSelectedDeckId(id)
    setEditDeckDialogOpen(true)
  }, [])

  const prepareDelete = useCallback((id: string) => {
    setSelectedDeckId(id)
    setDeleteDeckDialogOpen(true)
  }, [])

  const prepareLearn = useCallback((id: string) => {
    setSelectedDeckId(id)
    setLearnDialogOpen(true)
  }, [])

  const handleDelete = () => {
    if (!selectedDeckId.current) {
      return
    }
    deleteDeck(selectedDeckId.current)
    // setDeleteDeckDialogOpen(false)
  }

  const handleEditDialogOpenChange = (open: boolean) => {
    setEditDeckDialogOpen(open)
    !open && setSelectedDeckId(null)
  }

  const handleLearnDialogOpenChange = (open: boolean) => {
    setLearnDialogOpen(open)
    selectedDeckId.current = null
  }

  const handleCurrentUserDecksSearch = (checked: CheckedState) => {
    if (!currentUser) {
      return
    }
    if (checked) {
      handleDecksByAuthorIdSearch(currentUser.id)
    }
    if (!checked) {
      handleDecksByAuthorIdSearch(null)
    }
  }

  const availableMaxCardsCount = decksDataForTable?.maxCardsCount

  const handleCardsCountLimitsChange = (value: [number, number]) => {
    if (!availableMaxCardsCount) {
      return
    }
    const min = value[0] > 0 ? value[0] : null
    const max = value[1] < availableMaxCardsCount ? value[1] : null

    minCardsCount !== min && handleItemsMinCountChange(min)

    maxCardsCount !== max && handleItemsMaxCountChange(max)
  }

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => (
        <DeckActions
          deck={deck}
          onDelete={prepareDelete}
          onEdit={prepareEdit}
          onLearn={prepareLearn}
        />
      ),
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
        // alert('success')
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

  const handleCardGradeSubmit = (data: LearnDeckFormData) => {
    if (!selectedDeckId.current || !cardToLearnData) {
      return
    }

    const gradeAsNumber = Number.parseInt(data.grade)

    if (!gradeAsNumber) {
      return
    }

    rateCardAcquisition({
      body: { cardId: cardToLearnData.id, grade: gradeAsNumber },
      deckId: selectedDeckId.current,
    })
      .unwrap()
      .then(() => {
        // alert('success')
        setPreviousSelectedDeckId(selectedDeckId.current)
        fetchNewCardToLearn()
      })
      .catch(() => {
        alert('error')
      })
  }

  const changeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value) {
      handleNameSearch(value)
    } else {
      handleNameSearch('')
    }
  }

  const busy =
    isFetching ||
    isLoading ||
    isDeleting ||
    isUpdating ||
    deckIsBeingCreated ||
    selectedDeckIsFetching
  // todo: get rid of inline styles

  return (
    <>
      <ProgressBar className={clsx(s.progress)} show={busy} />
      <div
        style={{
          paddingTop: '20px',
          flexWrap: 'wrap',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '50%' }}>
          <TextField
            onChange={changeSearchString}
            onClear={() => handleNameSearch('')}
            type={'search'}
            value={name || ''}
          />
        </div>
        <Checkbox
          checked={!!authorId}
          label={'show only my decks'}
          onCheckedChange={handleCurrentUserDecksSearch}
        />
        <EditDeckDialog
          isSuccess={isSuccess}
          onOpenChange={setAddDeckDialogOpen}
          onSubmit={handleNewDeckDataSubmit}
          open={addDeckDialogOpen}
          title={'add deck'}
          trigger={<Button>Add new deck</Button>}
        />
        <div style={{ minWidth: '600px' }}>
          {availableMaxCardsCount && (
            <Slider
              defaultValue={[minCardsCount || 0, maxCardsCount || availableMaxCardsCount]}
              displayValues
              max={availableMaxCardsCount}
              onValueCommit={handleCardsCountLimitsChange}
            />
          )}
        </div>
        <Button onClick={handleResetAllQueries}>Reset queries</Button>
      </div>
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
      {selectedDeckData && (
        <DeleteDeckDialog
          description={`Do you really want to remove ${selectedDeckData.name}? All cards will be deleted.`}
          itemName={'deck'}
          onConfirm={handleDelete}
          onOpenChange={setDeleteDeckDialogOpen}
          open={deleteDeckDialogOpen}
          title={'Delete deck ?'}
        />
      )}
      {selectedDeckData && cardToLearnData && (
        <LearnDeckDialog
          card={cardToLearnData}
          isLoading={cardToLearnFetching}
          isSuccess={cardGradeSubmitSuccessful}
          onOpenChange={handleLearnDialogOpenChange}
          onSubmit={handleCardGradeSubmit}
          open={learnDialogOpen}
          title={`Learn "${selectedDeckData.name}"`}
        />
      )}
      <Table
        caption={'Decks'}
        columns={columns}
        data={decksDataForTable?.items || []}
        onChangeSort={handleSortChange}
        sort={tableSortProp}
      />
      {decksDataForTable?.pagination && (
        <div className={s.paginationContainer}>
          <Pagination
            onPageChange={handlePageChange}
            onPerPageCountChange={handlePerPageChange}
            pagination={decksDataForTable.pagination}
            perPage={itemsPerPage || 10}
          />
        </div>
      )}
    </>
  )
}
