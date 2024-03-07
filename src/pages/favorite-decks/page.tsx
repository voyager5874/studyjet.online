import type { DecksDialogTypes } from '@/common/dialog-types'
import type { DeckItem, GetDecksQueryParams } from '@/features/decks/types'
import type { Column, Sort } from '@/ui/table'

import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'

import { paths } from '@/app/app-routes'
import { decksDialogList } from '@/common/dialog-types'
import { useGetDecksByIdsListQuery } from '@/features/decks/api'
import { DecksPageDialogs } from '@/features/decks/page-dialogs'
import { decksTableColumns } from '@/features/decks/table/decks-table-columns'
import { DeckActions } from '@/features/decks/table/table-deck-actions'
import { usePageSearchParams } from '@/features/decks/use-page-search-params'
import { useLocalStorage } from '@/hooks'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/ui/button'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Slider } from '@/ui/slider'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import lodash from 'lodash'
import { LucideVariable } from 'lucide-react'

import s from './page.module.scss'

export const Page = () => {
  const {
    handleNameSearch,
    handleSortChange,
    tableSortProp,
    orderBy,
    maxCardsCount,
    minCardsCount,
    handleItemsMinCountChange,
    handleItemsMaxCountChange,
    handleResetAllQueries,
    handleClearFilters,
    activeFiltersCount,

    name,
  } = usePageSearchParams(paths.favoriteDecks)

  const [favoriteDecksIds, setFavoriteDecks] = useLocalStorage('favorites')

  const { data, currentData, isFetching, isLoading } = useGetDecksByIdsListQuery({
    ids: favoriteDecksIds,
  })

  const decksDataForTable = transformResponse(currentData ?? data, {
    name: useDebouncedValue(name, 1300),
    maxCardsCount,
    minCardsCount,
    orderBy,
  })

  const [selectedDeckId, setSelectedDeckId] = useState<null | string>(null)

  const [openedDialog, setOpenedDialog] = useState<DecksDialogTypes | null>(null)

  const prepareEdit = useCallback((id: string) => {
    setSelectedDeckId(id)
    setOpenedDialog(decksDialogList.updateDeck)
  }, [])

  const prepareDelete = useCallback((id: string) => {
    setSelectedDeckId(id)
    setOpenedDialog(decksDialogList.deleteDeck)
  }, [])

  const prepareLearn = useCallback((id: string) => {
    setSelectedDeckId(id)
    setOpenedDialog(decksDialogList.learn)
  }, [])

  const availableMaxCardsCount = getAvailableMaxCardsCount(decksDataForTable?.items)

  const handleCardsCountLimitsChange = (value: [number, number]) => {
    if (!availableMaxCardsCount) {
      return
    }
    const min = value[0] > 0 ? value[0] : null
    const max = value[1] < availableMaxCardsCount ? value[1] : null

    minCardsCount !== min && handleItemsMinCountChange(min)

    maxCardsCount !== max && handleItemsMaxCountChange(max)
  }

  const removeFromFavorites = (idToRemove: string) => {
    setFavoriteDecks(favoriteDecksIds.filter((id: string) => id !== idToRemove))
  }

  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      key: 'actions',
      render: deck => (
        <DeckActions
          deck={deck}
          onDelete={prepareDelete}
          //needs page refresh without this
          onDeleteFromFavorites={removeFromFavorites}
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
        {Boolean(activeFiltersCount) && <Button onClick={handleClearFilters}>Reset filters</Button>}
      </div>
    )
  }

  return (
    <>
      <ProgressBar className={cn.progress} show={busy} />
      <div className={cn.pageHeader}>
        <Typography variant={'large'}>Favorite decks</Typography>
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
        <Button onClick={handleClearFilters}>Reset filters</Button>

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
    </>
  )
}

function getAvailableMaxCardsCount(decks: DeckItem[] | null | undefined) {
  if (!decks?.length) {
    return null
  }

  return Math.max(...decks.map(deck => deck.cardsCount))
}

function transformResponse(
  response: { items: DeckItem[] } | null | undefined,
  arg: {
    maxCardsCount?: null | number
    minCardsCount?: null | number
    name?: null | string
    // orderBy?: Sort<DeckItem>
    orderBy?: GetDecksQueryParams['orderBy']
  }
) {
  if (!response || !response?.items?.length) {
    return { items: [] }
  }

  const result = structuredClone(response) as { items: DeckItem[] }

  if (arg?.minCardsCount) {
    result.items = result.items.filter(item => {
      if (!arg?.minCardsCount) {
        return item
      }

      return item.cardsCount >= arg.minCardsCount
    })
  }

  if (arg?.maxCardsCount) {
    result.items = result.items.filter(item => {
      if (!arg?.maxCardsCount) {
        return item
      }

      return item.cardsCount <= arg.maxCardsCount
    })
  }

  if (arg?.name) {
    const filterFn = (item: DeckItem) => {
      if (!arg?.name) {
        return item
      }
      const normalizedDeckName = item.name.toLowerCase()
      const normalizedSearchString = arg.name.trim().toLowerCase()

      return normalizedDeckName.includes(normalizedSearchString)
    }

    result.items = result.items.filter(filterFn)
  }

  if (arg?.orderBy) {
    const sortParam = getSortParam<DeckItem>(arg.orderBy)

    if (sortParam) {
      const field = sortParam.key
      const dir = sortParam.direction

      result.items = lodash.orderBy(result.items, [field as string], [dir])
    }
  }

  return result
}

function getSortParam<T>(query: null | string): Sort<T> | null {
  if (!query) {
    return null
  }
  const [key, direction] = query.split('-')

  return { key, direction } as Sort<T>
}
