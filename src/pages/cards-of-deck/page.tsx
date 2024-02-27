import type { CardsPageDialogsTypes } from '@/common/dialog-types'
import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { type ChangeEvent, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { usePageSearchParams } from '@/features/cards'
import { useGetCardsOfDeckQuery } from '@/features/cards/api'
import { cardsTableColumns } from '@/features/cards/table/cards-table-columns'
import { CardActions } from '@/features/cards/table/table-card-actions'
import { useGetDeckByIdQuery } from '@/features/decks/api'
import { useMeQuery } from '@/features/user/api'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { CardsPageDialogs } from '@/pages/cards-of-deck/cards-page-dialogs'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/ui/dropdown'
import { Pagination } from '@/ui/pagination'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { parseNumber } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'
import {
  LucideArrowLeft,
  LucideBookmark,
  LucideMoreVertical,
  LucidePencil,
  LucidePlayCircle,
  LucideTrash,
} from 'lucide-react'

import s from './page.module.scss'

export const Page = () => {
  const { id } = useParams<{ id: string }>()
  const { state } = useLocation()

  const { data: userData } = useMeQuery()
  const { data: currentDeckData } = useGetDeckByIdQuery(id ?? skipToken)

  const {
    handleTextSearch,
    handleResetPageQuery,
    pageQueryParams,
    handlePageChange,
    handlePerPageChange,
    handleSortChange,
    sortProp,
  } = usePageSearchParams()

  const { text } = pageQueryParams
  const debouncedSearchText = useDebouncedValue(text, 1300)
  const params = { ...pageQueryParams, text: debouncedSearchText }

  const { data, isFetching, isLoading } = useGetCardsOfDeckQuery(id ? { id, params } : skipToken)

  const {
    data: deckData,
    currentData: deckCurrentData,
    isFetching: deckDataFetching,
  } = useGetDeckByIdQuery(id ?? skipToken)

  const deck = deckCurrentData ?? deckData

  const [selectedCardId, setSelectedCardId] = useState<null | string>(null)

  const [openedDialog, setOpenedDialog] = useState<CardsPageDialogsTypes | null>(null)

  const prepareEdit = (id: string) => {
    setSelectedCardId(id)
    setOpenedDialog('update-card')
  }

  const prepareDelete = (id: string) => {
    setSelectedCardId(id)
    setOpenedDialog('delete-card')
  }

  const columns: Column<CardItem>[] = [
    ...cardsTableColumns,

    {
      key: 'actions',
      render: card => <CardActions card={card} onDelete={prepareDelete} onEdit={prepareEdit} />,
      title: '',
    },
  ]

  const changeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value) {
      // handleQuestionSearch(value)
      handleTextSearch(value)
    } else {
      // handleQuestionSearch('')
      handleTextSearch('')
    }
  }

  const busy = isFetching || isLoading || deckDataFetching

  const isOwner = userData && currentDeckData && userData?.id === currentDeckData?.userId

  const openCreateCardDialog = () => {
    setOpenedDialog('create-card')
  }

  const cn = {
    link: clsx(s.link),
    searchCardInputWrapper: clsx(s.textFieldContainer),
    pageHeader: clsx(s.pageHeader),
    dropdownMenuItem: clsx(s.dropdownMenuItem),
  }

  if (
    !busy &&
    !data?.items?.length &&
    !pageQueryParams?.question &&
    !pageQueryParams?.answer &&
    !pageQueryParams?.text
  ) {
    return (
      <>
        <CardsPageDialogs
          deckId={id}
          openedDialog={openedDialog}
          selectedCardId={selectedCardId}
          setOpenedDialog={setOpenedDialog}
          setSelectedCardId={setSelectedCardId}
        />
        <div className={clsx(s.page)}>
          <Typography>There is no cards in this deck</Typography>
          {id && isOwner && <Button onClick={openCreateCardDialog}>Add new card</Button>}
        </div>
      </>
    )
  }

  if (
    !busy &&
    !data?.items?.length &&
    (pageQueryParams?.question || pageQueryParams?.answer || pageQueryParams?.text)
  ) {
    return (
      <div className={clsx(s.page)}>
        <Typography>Nothing found</Typography>
        <Button onClick={handleResetPageQuery}>Reset filters</Button>
      </div>
    )
  }

  return (
    <>
      <ProgressBar className={clsx(s.progress)} show={busy} />

      <div className={cn.pageHeader}>
        <div className={clsx(s.flexRow)}>
          <div className={clsx(s.flexColumn)}>
            <Link className={cn.link} to={'/decks'}>
              <LucideArrowLeft size={14} />
              <Typography variant={'body2'}>Back to the decks list</Typography>
            </Link>

            <div className={clsx(s.flexRow)}>
              <Typography variant={'large'}>{deck?.name}</Typography>
              <DropdownMenu
                align={'start'}
                trigger={
                  <Button variant={'icon'}>
                    <LucideMoreVertical />
                  </Button>
                }
              >
                {isOwner && (
                  <DropdownMenuItem
                    className={cn.dropdownMenuItem}
                    onClick={() => setOpenedDialog('update-deck')}
                  >
                    <div>
                      <LucidePencil size={14} />
                    </div>
                    <Typography variant={'body2'}>Edit</Typography>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className={cn.dropdownMenuItem}>
                  <Link
                    className={cn.link}
                    replace
                    state={{ ...state, referer: `decks/${id}/cards` }}
                    to={`/decks/${id}/learn`}
                  >
                    <LucidePlayCircle size={14} />
                    <Typography variant={'body2'}>{`Learn "${deck?.name}"`}</Typography>
                  </Link>
                </DropdownMenuItem>

                {isOwner && (
                  <DropdownMenuItem
                    className={cn.dropdownMenuItem}
                    onClick={() => setOpenedDialog('delete-deck')}
                  >
                    <div>
                      <LucideTrash size={14} />
                    </div>
                    <Typography variant={'body2'}>Delete</Typography>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className={cn.dropdownMenuItem}>
                  <div>
                    <LucideBookmark size={14} />
                  </div>
                  <Typography variant={'body2'}>Add to favorites</Typography>
                </DropdownMenuItem>
              </DropdownMenu>
            </div>
            {isOwner && (
              <Typography className={clsx(s.subduedText)} variant={'caption'}>
                you own this deck
              </Typography>
            )}
          </div>
        </div>
        {id && isOwner && (
          <Button onClick={() => setOpenedDialog('create-card')}>Add new card</Button>
        )}
      </div>

      <div className={cn.searchCardInputWrapper}>
        <TextField
          onChange={changeSearchString}
          onClear={handleResetPageQuery}
          type={'search'}
          value={pageQueryParams?.text || ''}
        />
      </div>
      <CardsPageDialogs
        deckId={id}
        openedDialog={openedDialog}
        selectedCardId={selectedCardId}
        setOpenedDialog={setOpenedDialog}
        setSelectedCardId={setSelectedCardId}
      />
      {data?.items?.length && (
        <Table
          columns={columns}
          data={data?.items || []}
          onChangeSort={handleSortChange}
          sort={sortProp}
        />
      )}
      {data?.pagination && (
        <div className={clsx(s.paginationContainer)}>
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
