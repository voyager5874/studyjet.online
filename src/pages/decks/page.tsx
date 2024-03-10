import type { DecksDialogTypes } from '@/common/dialog-types'
import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'
import type { CheckedState } from '@radix-ui/react-checkbox'

import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'

import { useGetDecksQuery } from '@/features/decks/api'
import { DecksPageDialogs } from '@/features/decks/page-dialogs'
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
import { Typography } from '@/ui/typography'
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

  const { data, currentData, isFetching, isLoading } = useGetDecksQuery({
    currentPage,
    itemsPerPage,
    orderBy,
    authorId,
    maxCardsCount,
    minCardsCount,
    name: useDebouncedValue(name, 1300),
  })
  const decksDataForTable = currentData ?? data

  const { data: currentUser } = useMeQuery()

  const [selectedDeckId, setSelectedDeckId] = useState<null | string>(null)

  // const previousCardId = useRef<null | string>(null)

  const [openedDialog, setOpenedDialog] = useState<DecksDialogTypes | null>(null)

  const prepareEdit = useCallback((id: string) => {
    setSelectedDeckId(id)
    setOpenedDialog('update-deck')
  }, [])

  const prepareDelete = useCallback((id: string) => {
    setSelectedDeckId(id)
    setOpenedDialog('delete-deck')
  }, [])

  const prepareLearn = useCallback((id: string) => {
    setSelectedDeckId(id)
    setOpenedDialog('learn')
  }, [])

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

  const changeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value) {
      handleNameSearch(value)
    } else {
      handleNameSearch('')
    }
  }

  const openCreateDeckDialog = useCallback(() => {
    setOpenedDialog('create-deck')
  }, [])

  const handleDecksDialogSuccess = (dialog: DecksDialogTypes) => {
    if (dialog === 'create-deck') {
      handlePageChange(1)
      handleSortChange<DeckItem>({ key: 'updated', direction: 'desc' })
      handleItemsMinCountChange(null)
    }
  }

  const busy = isFetching || isLoading

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
        <Button onClick={openCreateDeckDialog}>Add new deck</Button>
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

      <DecksPageDialogs
        onSuccess={handleDecksDialogSuccess}
        openedDialog={openedDialog}
        selectedDeckId={selectedDeckId}
        setOpenedDialog={setOpenedDialog}
        setSelectedDeckId={setSelectedDeckId}
      />
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
