import type { CardFormData } from '@/features/cards/edit-dialog/card-form-schema'
import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
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
import { usePageSearchParams } from '@/hooks'
import { useConfirm } from '@/hooks/use-confirm'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/ui/dropdown'
import { Pagination } from '@/ui/pagination'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Table } from '@/ui/table'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { getFileFromUrl, parseNumber } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'
import { LucideMoreVertical } from 'lucide-react'

import s from './page.module.scss'

export const Page = () => {
  const { id } = useParams<{ id: string }>()
  const { data: userData } = useMeQuery()
  const { data: currentDeckData } = useGetDeckByIdQuery(id ?? skipToken)

  const { pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange, sortProp } =
    usePageSearchParams()

  const { data, isFetching, isLoading } = useGetCardsOfDeckQuery(
    id ? { id, params: pageQueryParams ?? {} } : skipToken
  )

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

    const formData = new FormData()

    formData.append('question', data.question)
    formData.append('answer', data.answer)

    const questionImageDataUrl = (data?.questionImg && data.questionImg[1]) || null

    if (questionImageDataUrl) {
      const questionImage = await getFileFromUrl(questionImageDataUrl)

      formData.append('questionImg', questionImage)
    }
    setAddCardDialogOpen(false)

    const answerImageDataUrl = (data?.answerImg && data.answerImg[1]) || null

    if (answerImageDataUrl) {
      const answerImage = await getFileFromUrl(answerImageDataUrl)

      formData.append('answerImg', answerImage)
    }
    setAddCardDialogOpen(false)

    createCard({ body: formData, deckId: id })
      .unwrap()
      .then(() => {
        alert('success')
      })
      .catch(() => {
        alert('error')
        setAddCardDialogOpen(true)
      })
  }

  const handleEditedCardDataSubmit = async (data: CardFormData) => {
    if (!selectedCardData) {
      return
    }

    const formData = new FormData()

    const questionImageWasErased = data?.questionImg && data.questionImg[0] === IMAGE_WAS_ERASED
    const updatedQuestionImageDataUrl =
      !questionImageWasErased && data?.questionImg && data.questionImg[1]

    const answerImageWasErased = data?.answerImg && data.answerImg[0] === IMAGE_WAS_ERASED
    const updatedAnswerImageDataUrl = !answerImageWasErased && data?.answerImg && data.answerImg[1]

    const questionChanged = data.question !== selectedCardData.question
    const answerChanged = data.answer !== selectedCardData.answer

    questionChanged && formData.append('question', data.question)
    answerChanged && formData.append('answer', data.answer)

    if (updatedQuestionImageDataUrl) {
      const image = await getFileFromUrl(updatedQuestionImageDataUrl)

      formData.append('questionImg', image)
    }
    if (questionImageWasErased) {
      formData.append('questionImg', '')
    }

    if (updatedAnswerImageDataUrl) {
      const image = await getFileFromUrl(updatedAnswerImageDataUrl)

      formData.append('answerImg', image)
    }
    if (answerImageWasErased) {
      formData.append('answerImg', '')
    }

    setEditCardDialogOpen(false)

    updateCard({ body: formData, cardId: selectedCardData.id })
      .unwrap()
      .then(() => {
        setSelectedCardId(null)

        alert('success')
      })
      .catch(() => {
        alert('error')
        setEditCardDialogOpen(true)
      })
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

  if (!busy && !data?.items?.length) {
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

  const cn = {
    link: clsx(s.link),
    queriesControlsContainer: clsx(s.pageControlsContainer),
  }

  return (
    <>
      <ProgressBar className={clsx(s.progress)} show={busy} />

      <div className={cn.queriesControlsContainer}>
        <div className={clsx(s.flexRow, s.fullWidth)}>
          <div className={clsx(s.flexColumn)}>
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
                {isOwner && <DropdownMenuItem>Edit</DropdownMenuItem>}
                <DropdownMenuItem>
                  <Typography
                    as={Link}
                    replace
                    state={{ referer: `decks/${id}/cards` }}
                    to={`/decks/${id}/learn`}
                    variant={'link1'}
                  >
                    {`Learn "${deck?.name}"`}
                  </Typography>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Typography variant={'body2'}>Add to favorites</Typography>
                </DropdownMenuItem>
                {isOwner && <DropdownMenuItem>Delete</DropdownMenuItem>}
              </DropdownMenu>
            </div>
            {isOwner && (
              <Typography className={clsx(s.subduedText)} variant={'caption'}>
                you own this deck
              </Typography>
            )}
          </div>
        </div>
        <div className={clsx(s.textFieldContainer)}>
          <TextField type={'search'} />
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
