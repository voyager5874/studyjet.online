import type { CardFormData } from '@/features/cards/edit-dialog/card-form-schema'
import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import {
  useCreateCardMutation,
  useDeleteCardMutation,
  useGetCardByIdQuery,
  useGetCardsOfDeckQuery,
  useUpdateCardMutation,
} from '@/features/cards/api'
import { EditCardDialog } from '@/features/cards/edit-dialog'
import { cardsTableColumns } from '@/features/cards/table/cards-table-columns'
import { CardActions } from '@/features/cards/table/table-card-actions'
import { usePageSearchParams } from '@/hooks'
import { Button } from '@/ui/button'
import { Pagination } from '@/ui/pagination'
import { Table } from '@/ui/table'
import { getFileFromUrl, parseNumber } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'

export const Page = () => {
  const { id } = useParams<{ id: string }>()

  const { pageQueryParams, handlePageChange, handlePerPageChange, handleSortChange, sortProp } =
    usePageSearchParams()

  const { data, isFetching, isLoading } = useGetCardsOfDeckQuery(
    id ? { id, params: pageQueryParams ?? {} } : skipToken
  )

  const [addCardDialogOpen, setAddCardDialogOpen] = useState<boolean>(false)
  const [createCard, { isSuccess: createCardSuccess, isLoading: isCreating }] =
    useCreateCardMutation()

  const [editCardDialogOpen, setEditCardDialogOpen] = useState<boolean>(false)
  const [selectedCardId, setSelectedCardId] = useState<null | string>(null)

  const { currentData: selectedCardData, isFetching: selectedCardFetching } = useGetCardByIdQuery(
    selectedCardId ?? skipToken
  )

  const [updateCard, { isSuccess: updateCardSuccess, isLoading: cardIsBeingUpdated }] =
    useUpdateCardMutation()

  const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation()

  const getCardIdFromTable = (id: string) => {
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
      render: card => <CardActions card={card} onDelete={deleteCard} onEdit={getCardIdFromTable} />,
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
    isDeleting

  return (
    <>
      <div>{busy && 'working...'}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      ></div>
      {id && (
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
      <Table
        caption={'Cards'}
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
