import type { CardsPageDialogsTypes } from '@/common/dialog-types'
import type { CardFormData } from '@/features/cards/edit-dialog/card-form-schema'
import type { CardItem } from '@/features/cards/types'

import { useNavigate } from 'react-router-dom'

import { isDecksDialogType } from '@/common/dialog-types'
import {
  useCreateCardMutation,
  useDeleteCardMutation,
  useGetCardByIdQuery,
  useUpdateCardMutation,
} from '@/features/cards/api'
import { DeleteCardDialog } from '@/features/cards/delete-dialog'
import { EditCardDialog } from '@/features/cards/edit-dialog'
import { DecksPageDialogs } from '@/pages/decks/decks-page-dialogs'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { useToast } from '@/ui/toast'
import { createSubmitData } from '@/utils/objects'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'

import s from './page.module.scss'

type Props = {
  deckId?: null | string
  // deckName?: null | string
  openedDialog: CardsPageDialogsTypes | null
  selectedCardId: null | string
  setOpenedDialog: (dialog: CardsPageDialogsTypes | null) => void
  setSelectedCardId: (id: null | string) => void
}
export const CardsPageDialogs = (props: Props) => {
  const { selectedCardId, setSelectedCardId, openedDialog, setOpenedDialog, deckId } = props

  const navigate = useNavigate()

  const { toast } = useToast()

  const [createCard, { isSuccess: createCardSuccess, isLoading: isCreating }] =
    useCreateCardMutation()

  const { currentData: selectedCardData, isFetching: selectedCardFetching } = useGetCardByIdQuery(
    selectedCardId ?? skipToken
  )

  const [updateCard, { isSuccess: updateCardSuccess, isLoading: cardIsBeingUpdated }] =
    useUpdateCardMutation()

  const [deleteCard, { isLoading: cardIsBeingDeleted }] = useDeleteCardMutation()

  const handleCardDelete = () => {
    if (!selectedCardId) {
      return
    }
    deleteCard(selectedCardId)
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
  }

  const handleNewCardDataSubmit = async (data: CardFormData) => {
    if (!deckId) {
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

    setOpenedDialog(null)

    createCard({ body: submitData, deckId })
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
        setOpenedDialog('create-card')
      })
  }

  const handleEditedCardDataSubmit = async (data: CardFormData) => {
    if (!selectedCardData) {
      return
    }
    const submitData = await createSubmitData(data, selectedCardData)

    setOpenedDialog(null)

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
        setOpenedDialog('update-card')
      })
  }

  const handleDecksActionSuccess = () => {
    if (openedDialog === 'delete-deck') {
      navigate(-1)
    }
  }

  const handleClose = (open: boolean) => {
    !open && setOpenedDialog(null)
    if (openedDialog === 'delete-card' || openedDialog === 'update-card') {
      setSelectedCardId(null)
    }
  }

  const busy = cardIsBeingUpdated || isCreating || selectedCardFetching || cardIsBeingDeleted

  return (
    <>
      <ProgressBar className={clsx(s.progress)} show={busy} />
      {deckId && (
        <DecksPageDialogs
          onSuccess={handleDecksActionSuccess}
          openedDialog={isDecksDialogType(openedDialog) ? openedDialog : null}
          selectedDeckId={deckId}
          setOpenedDialog={setOpenedDialog}
        />
      )}
      <EditCardDialog
        isSuccess={createCardSuccess}
        onOpenChange={handleClose}
        onSubmit={handleNewCardDataSubmit}
        open={openedDialog === 'create-card'}
        title={'add card'}
      />
      {selectedCardData && (
        <EditCardDialog
          card={selectedCardData}
          isSuccess={updateCardSuccess}
          onOpenChange={handleClose}
          onSubmit={handleEditedCardDataSubmit}
          open={openedDialog === 'update-card'}
          title={'edit card'}
        />
      )}
      <DeleteCardDialog
        onConfirm={handleCardDelete}
        onOpenChange={handleClose}
        open={openedDialog === 'delete-card'}
      />
    </>
  )
}
