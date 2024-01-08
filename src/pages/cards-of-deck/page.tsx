import type { CardItem } from '@/features/cards/types'
import type { Column } from '@/ui/table'

import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCreateCardMutation, useGetCardsOfDeckQuery } from '@/features/cards/api'
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
  const [createCard] = useCreateCardMutation()

  const columns: Column<CardItem>[] = [
    ...cardsTableColumns,

    {
      key: 'actions',
      render: card => <CardActions card={card} />,
      title: '',
    },
  ]

  const handleNewCardDataSubmit = async (data: any) => {
    if (!id) {
      return
    }

    const formData = new FormData()

    formData.append('question', data.question)
    formData.append('answer', data.answer)

    const questionImageDataUrl = (data?.question && data.question[1]) || null

    if (questionImageDataUrl) {
      const questionImage = await getFileFromUrl(questionImageDataUrl)

      formData.append('questionImg', questionImage)
    }
    setAddCardDialogOpen(false)

    const answerImageDataUrl = (data?.question && data.question[1]) || null

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

  const busy = isFetching || isLoading

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
          onOpenChange={setAddCardDialogOpen}
          onSubmit={handleNewCardDataSubmit}
          open={addCardDialogOpen}
          title={'add card'}
          trigger={<Button>Add new card</Button>}
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
