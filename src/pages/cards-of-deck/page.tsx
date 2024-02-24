import type { CardFormData } from '@/features/cards/edit-dialog/card-form-schema'
import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { type ChangeEvent, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { usePageSearchParams } from '@/features/cards'
import {
  useCreateCardMutation,
  useDeleteCardMutation,
  useGetCardByIdQuery,
  useGetCardsOfDeckQuery,
  useUpdateCardMutation,
} from '@/features/cards/api'
import { DeleteCardDialog } from '@/features/cards/delete-dialog'
import { EditCardDialog } from '@/features/cards/edit-dialog'
import { cardsTableColumns } from '@/features/cards/table/cards-table-columns'
import { CardActions } from '@/features/cards/table/table-card-actions'
import { useGetDeckByIdQuery } from '@/features/decks/api'
import { useMeQuery } from '@/features/user/api'
import { useConfirm } from '@/hooks/use-confirm'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/ui/dropdown'
import { Pagination } from '@/ui/pagination'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { useToast } from '@/ui/toast'
import { Typography } from '@/ui/typography'
import { parseNumber } from '@/utils'
import { createSubmitData } from '@/utils/objects'
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

  const { toast } = useToast()

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

  const [createCard, { isSuccess: createCardSuccess, isLoading: isCreating }] =
    useCreateCardMutation()

  const selectedCardId = useRef<null | string>(null)

  const setSelectedCardId = (id: null | string) => {
    selectedCardId.current = id
  }

  const { currentData: selectedCardData, isFetching: selectedCardFetching } = useGetCardByIdQuery(
    selectedCardId?.current ?? skipToken
  )

  const [addCardDialogOpen, setAddCardDialogOpen] = useState<boolean>(false)

  const [editCardDialogOpen, setEditCardDialogOpen] = useState<boolean>(false)
  const [deleteCardDialogOpen, setDeleteCardDialogOpen] = useState<boolean>(false)

  const [updateCard, { isSuccess: updateCardSuccess, isLoading: cardIsBeingUpdated }] =
    useUpdateCardMutation()

  const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation()

  const {
    waitConfirm: waitDeleteConfirm,
    cancel: cancelDelete,
    confirm: confirmDelete,
    initialize: initializeWaitForDelete,
  } = useConfirm()
  const handleCardDelete = (id: string) => {
    initializeWaitForDelete(() => {
      deleteCard(id)
        .unwrap()
        .then(() => {
          toast({
            title: 'Card has been deleted',
            variant: 'success',
            type: 'foreground',
          })
        })
        .catch(() => {
          toast({
            title: 'Failed to delete the card',
            variant: 'danger',
            type: 'foreground',
          })
        })
    })

    setDeleteCardDialogOpen(true)
  }

  const prepareEdit = (id: string) => {
    setSelectedCardId(id)
    setEditCardDialogOpen(true)
  }

  const handleEditDialogOpenChange = (open: boolean) => {
    setEditCardDialogOpen(open)
    !open && setSelectedCardId(null)
  }

  const columns: Column<CardItem>[] = [
    ...cardsTableColumns,

    {
      key: 'actions',
      render: card => <CardActions card={card} onDelete={handleCardDelete} onEdit={prepareEdit} />,
      title: '',
    },
  ]

  const handleNewCardDataSubmit = async (data: CardFormData) => {
    if (!id) {
      return
    }
    const submitData = await createSubmitData(data, {
      answerImg: '',
      questionImg: '',
      answer: '',
      question: '',
      questionVideo: '',
      answerVideo: '',
    } as CardItem)

    setAddCardDialogOpen(false)

    createCard({ body: submitData, deckId: id })
      .unwrap()
      .then(() => {
        toast({
          title: 'New card added',
          variant: 'success',
          type: 'foreground',
        })
      })
      .catch(err => {
        toast({
          title: 'Failed to add new card',
          description: err?.data?.message || '',
          variant: 'danger',
          type: 'foreground',
        })
        setAddCardDialogOpen(true)
      })
  }

  const handleEditedCardDataSubmit = async (data: CardFormData) => {
    if (!selectedCardData) {
      return
    }
    const submitData = await createSubmitData(data, selectedCardData)

    setEditCardDialogOpen(false)

    updateCard({ body: submitData, cardId: selectedCardData.id })
      .unwrap()
      .then(() => {
        setSelectedCardId(null)
        toast({
          title: 'Card updated',
          variant: 'success',
          type: 'foreground',
        })
      })
      .catch(err => {
        toast({
          title: 'Failed to update the card',
          description: err?.data?.message || '',
          variant: 'danger',
          type: 'foreground',
        })
        setEditCardDialogOpen(true)
      })
  }

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

  const busy =
    isFetching ||
    isLoading ||
    cardIsBeingUpdated ||
    isCreating ||
    selectedCardFetching ||
    isDeleting ||
    deckDataFetching

  const isOwner = userData && currentDeckData && userData?.id === currentDeckData?.userId

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
      <div className={clsx(s.page)}>
        <Typography>There is no cards in this deck</Typography>
        {isOwner && id && (
          <EditCardDialog
            isSuccess={createCardSuccess}
            onOpenChange={setAddCardDialogOpen}
            onSubmit={handleNewCardDataSubmit}
            open={addCardDialogOpen}
            title={'add card'}
            trigger={<Button>Add new card</Button>}
          />
        )}
      </div>
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
                  <DropdownMenuItem className={cn.dropdownMenuItem}>
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
                  <DropdownMenuItem className={cn.dropdownMenuItem}>
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
          <EditCardDialog
            isSuccess={createCardSuccess}
            onOpenChange={setAddCardDialogOpen}
            onSubmit={handleNewCardDataSubmit}
            open={addCardDialogOpen}
            title={'add card'}
            trigger={<Button>Add new card</Button>}
          />
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

      {selectedCardData && (
        <EditCardDialog
          card={selectedCardData}
          isSuccess={updateCardSuccess}
          onOpenChange={handleEditDialogOpenChange}
          onSubmit={handleEditedCardDataSubmit}
          open={editCardDialogOpen}
          title={'edit card'}
        />
      )}
      {waitDeleteConfirm && (
        <DeleteCardDialog
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          onOpenChange={setDeleteCardDialogOpen}
          open={deleteCardDialogOpen}
        />
      )}
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
