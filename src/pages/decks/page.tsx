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
import { useToast } from '@/ui/toast'
import { Typography } from '@/ui/typography'
import { getFileFromUrl } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'
import { LucideVariable } from 'lucide-react'

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
    handleClearFilters,
    activeFiltersCount,

    name,
  } = usePageSearchParams()

  const { toast } = useToast()

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

  const [
    createDeck,
    {
      isSuccess: createDeckSuccess,
      isLoading: deckIsBeingCreated,
      // isError: createDeckErrorFailure,
      // error: createDeckErrorData,
    },
  ] = useCreateDecksMutation()

  const [deleteDeck, { isLoading: isDeleting }] = useDeleteDeckMutation()
  const [updateDeck, { isLoading: isUpdating, isSuccess: updateSuccessful }] =
    useUpdateDeckMutation()
  const [
    rateCardAcquisition,
    { isSuccess: cardGradeSubmitSuccessful, isLoading: cardGradeIsSubmitting },
  ] = useRateCardAcquisitionMutation()

  const selectedDeckId = useRef<null | string>(null)

  const setSelectedDeckId = (id: null | string) => {
    selectedDeckId.current = id
  }

  const previousCardId = useRef<null | string>(null)

  const { currentData: selectedDeckData, isFetching: selectedDeckIsFetching } = useGetDeckByIdQuery(
    selectedDeckId?.current ?? skipToken
  )

  const { currentData: cardToLearnData, isFetching: cardToLearnFetching } =
    useGetRandomCardFromDeckQuery(
      selectedDeckId?.current
        ? {
            deckId: selectedDeckId?.current,
            ...(previousCardId.current && {
              previousCardId: previousCardId.current,
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
      .unwrap()
      .then(() => {
        toast({
          description: 'Deck has been deleted successfully.',
          variant: 'success',
        })
      })
      .catch(() => {
        toast({
          description: 'Failed to delete the deck.',
          variant: 'danger',
        })
      })
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

      cover && formData.append('cover', cover)
    }
    setAddDeckDialogOpen(false)

    createDeck(formData)
      .unwrap()
      .then(() => {
        toast({
          title: 'Deck has been created successfully',
          variant: 'success',
          type: 'foreground',
        })
      })
      .catch(err => {
        toast({
          title: 'Failed to create deck',
          description: err?.data?.message || '',
          variant: 'dangerColored',
          type: 'foreground',
        })
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

      cover && updateDeckFormData.append('cover', cover)
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
        toast({
          title: 'Deck has been updated',
          variant: 'success',
          type: 'foreground',
          position: 'bottomRight',
          from: 'bottom',
        })
        setSelectedDeckId(null)
      })
      .catch(err => {
        toast({
          title: 'Failed to update deck',
          description: err?.data?.message || '',
          variant: 'danger',
          position: 'bottomRight',
          from: 'bottom',
          type: 'foreground',
        })
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
        previousCardId.current = cardToLearnData.id
        // fetchNewCardToLearn() //no need for manual refetch
      })
      .catch(err => {
        toast({
          title: 'Failed to rate acquisition',
          description: err?.data?.message || '',
          variant: 'danger',
          type: 'foreground',
        })
      })
  }

  const handleShowCardAnswer = () => {
    // previousCardId.current = cardToLearnData.id
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

  const cn = {
    page: clsx(s.page),
    pageHeader: clsx(s.pageHeader),
    progress: clsx(s.progress),
    pageQueriesContainer: clsx(s.pageQueriesContainer),
    searchInputWrapper: clsx(s.searchInputWrapper),
    cardsCountSliderWrapper: clsx(s.cardsCountSliderWrapper),
    paginationContainer: clsx(s.paginationContainer),
  }

  if (!busy && !decksDataForTable?.items?.length) {
    return (
      <div className={cn.page}>
        <Typography>No deck found</Typography>
        {activeFiltersCount && <Button onClick={handleResetAllQueries}>Reset filters</Button>}
      </div>
    )
  }

  return (
    <>
      <ProgressBar className={cn.progress} show={busy} />
      <div className={cn.pageHeader}>
        <Typography variant={'large'}>Decks list</Typography>
        <EditDeckDialog
          isSuccess={createDeckSuccess}
          onOpenChange={setAddDeckDialogOpen}
          onSubmit={handleNewDeckDataSubmit}
          open={addDeckDialogOpen}
          title={'add deck'}
          trigger={<Button>Add new deck</Button>}
        />
      </div>
      <div className={cn.pageQueriesContainer}>
        <div className={cn.cardsCountSliderWrapper}>
          {availableMaxCardsCount && (
            <>
              <Typography variant={'body2'}>Cards count filter</Typography>
              <Slider
                defaultValue={[minCardsCount || 0, maxCardsCount || availableMaxCardsCount]}
                displayValues
                max={availableMaxCardsCount}
                onValueCommit={handleCardsCountLimitsChange}
              />
            </>
          )}
        </div>
        <Button onClick={handleResetAllQueries} variant={'ghost'}>
          <LucideVariable />
        </Button>
        <Button onClick={handleClearFilters}>Reset all filters</Button>

        <div className={cn.searchInputWrapper}>
          <TextField
            onChange={changeSearchString}
            onClear={() => handleNameSearch('')}
            type={'search'}
            value={name || ''}
          />
        </div>
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
          disabled={cardGradeIsSubmitting}
          isLoading={cardToLearnFetching}
          isSuccess={cardGradeSubmitSuccessful}
          onOpenChange={handleLearnDialogOpenChange}
          onShowAnswer={handleShowCardAnswer}
          onSubmit={handleCardGradeSubmit}
          open={learnDialogOpen}
          title={`Learn "${selectedDeckData.name}"`}
        />
      )}
      <Table
        columns={columns}
        data={decksDataForTable?.items || []}
        onChangeSort={handleSortChange}
        sort={tableSortProp}
      />
      {decksDataForTable?.pagination && (
        <div className={cn.paginationContainer}>
          <Pagination
            onPageChange={handlePageChange}
            onPerPageCountChange={handlePerPageChange}
            pagination={decksDataForTable.pagination}
            perPage={itemsPerPage || 10}
          />
          <Checkbox
            checked={!!authorId}
            label={'Show only my decks'}
            onCheckedChange={handleCurrentUserDecksSearch}
          />
        </div>
      )}
    </>
  )
}
