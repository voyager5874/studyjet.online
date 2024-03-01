import type { DecksDialogTypes } from '@/common/dialog-types'
import type { DeckFormData } from '@/features/decks/edit-dialog/deck-form-schema'
import type { LearnDeckFormData } from '@/features/decks/learn-dialog/learn-deck-form-schema'
import type { DeckItem } from '@/features/decks/types'

import { useRef } from 'react'

import { decksDialogList } from '@/common/dialog-types'
import { useGetRandomCardFromDeckQuery, useRateCardAcquisitionMutation } from '@/features/cards/api'
import {
  useCreateDecksMutation,
  useDeleteDeckMutation,
  useGetDeckByIdQuery,
  useUpdateDeckMutation,
} from '@/features/decks/api'
import { DeleteDeckDialog } from '@/features/decks/delete-dialog'
import { EditDeckDialog } from '@/features/decks/edit-dialog'
import { LearnDeckDialog } from '@/features/decks/learn-dialog'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { useToast } from '@/ui/toast'
import { createSubmitData } from '@/utils/objects'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'

import s from './page.module.scss'

type Props = {
  onError?: () => void
  onSuccess?: () => void
  openedDialog: DecksDialogTypes | null
  selectedDeckId: null | string
  setOpenedDialog: (dialog: DecksDialogTypes | null) => void
  setSelectedDeckId?: (deckId: null | string) => void
}

export const DecksPageDialogs = (props: Props) => {
  const { onSuccess, onError, setSelectedDeckId, selectedDeckId, setOpenedDialog, openedDialog } =
    props

  const { toast } = useToast()

  const [createDeck, { isSuccess: createDeckSuccess, isLoading: deckIsBeingCreated }] =
    useCreateDecksMutation()

  const [deleteDeck, { isLoading: isDeleting }] = useDeleteDeckMutation()

  const [updateDeck, { isLoading: isUpdating, isSuccess: updateSuccessful }] =
    useUpdateDeckMutation()

  const [
    rateCardAcquisition,
    { isSuccess: cardGradeSubmitSuccessful, isLoading: cardGradeIsSubmitting },
  ] = useRateCardAcquisitionMutation()

  const previousCardId = useRef<null | string>(null)

  const { currentData: selectedDeckData, isFetching: selectedDeckIsFetching } = useGetDeckByIdQuery(
    selectedDeckId ?? skipToken
  )

  const {
    currentData: cardToLearnCurrentData,
    data: cardToLearnData,
    isFetching: cardToLearnFetching,
  } = useGetRandomCardFromDeckQuery(
    selectedDeckId && openedDialog === 'learn'
      ? {
          deckId: selectedDeckId,
          ...(previousCardId.current && {
            previousCardId: previousCardId.current,
          }),
        }
      : skipToken
  )

  const handleDelete = () => {
    if (!selectedDeckId) {
      return
    }
    deleteDeck(selectedDeckId)
      .unwrap()
      .then(() => {
        toast({
          description: 'Deck has been deleted successfully.',
          variant: 'success',
        })
        onSuccess && onSuccess()
      })
      .catch(() => {
        toast({
          description: 'Failed to delete the deck.',
          variant: 'danger',
        })
        onError && onError()
      })
  }

  const handleNewDeckDataSubmit = async (data: DeckFormData) => {
    const submitData = await createSubmitData(data, {
      name: '',
      isPrivate: undefined,
      cover: '',
    } as Partial<DeckItem>)

    setOpenedDialog(null)

    createDeck(submitData)
      .unwrap()
      .then(() => {
        toast({
          title: 'Deck has been created successfully',
          variant: 'success',
          type: 'foreground',
        })
        onSuccess && onSuccess()
      })
      .catch(err => {
        toast({
          title: 'Failed to create deck',
          description: err || '',
          variant: 'dangerColored',
          type: 'foreground',
        })
        setOpenedDialog(decksDialogList.createDeck)
        onError && onError()
      })
  }

  const handleDeckUpdatedDataSubmit = async (data: DeckFormData) => {
    if (!selectedDeckData) {
      return
    }

    const submitData = await createSubmitData(data, selectedDeckData)

    setOpenedDialog(null)

    updateDeck({ id: selectedDeckData.id, body: submitData })
      .unwrap()
      .then(() => {
        toast({
          title: 'Deck has been updated',
          variant: 'success',
          type: 'foreground',
          position: 'bottomRight',
          from: 'bottom',
        })
        onSuccess && onSuccess()
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
        setOpenedDialog(decksDialogList.updateDeck)
        onError && onError()
      })
  }

  const handleCardGradeSubmit = (data: LearnDeckFormData) => {
    if (!selectedDeckId || !cardToLearnCurrentData) {
      return
    }

    const gradeAsNumber = Number.parseInt(data.grade)

    if (!gradeAsNumber) {
      return
    }

    rateCardAcquisition({
      body: { cardId: cardToLearnCurrentData.id, grade: gradeAsNumber },
      deckId: selectedDeckId,
    })
      .unwrap()
      .then(() => {
        previousCardId.current = cardToLearnCurrentData.id
        // fetchNewCardToLearn() //no need for manual refetch
        onSuccess && onSuccess()
      })
      .catch(err => {
        toast({
          title: 'Failed to rate acquisition',
          description: err?.data?.message || '',
          variant: 'danger',
          type: 'foreground',
        })
        onError && onError()
      })
  }

  const cardForLearnDialog = cardToLearnCurrentData ?? cardToLearnData

  const busy = isDeleting || isUpdating || deckIsBeingCreated || selectedDeckIsFetching

  const cn = {
    progress: clsx(s.progress),
    dialog: clsx(busy && s.inactive),
  }

  const handleClose = (open: boolean) => {
    !open && setOpenedDialog(null)
    if (openedDialog === 'learn' || openedDialog === decksDialogList.updateDeck) {
      setSelectedDeckId && setSelectedDeckId(null)
    }
  }

  return (
    <>
      <ProgressBar className={cn.progress} show={busy} />

      <EditDeckDialog
        isSuccess={createDeckSuccess}
        onOpenChange={handleClose}
        onSubmit={handleNewDeckDataSubmit}
        open={openedDialog === decksDialogList.createDeck}
        title={'add deck'}
      />
      {selectedDeckData && (
        <EditDeckDialog
          deck={selectedDeckData}
          isSuccess={updateSuccessful}
          onOpenChange={handleClose}
          onSubmit={handleDeckUpdatedDataSubmit}
          open={openedDialog === decksDialogList.updateDeck}
          title={'edit deck'}
        />
      )}
      {selectedDeckData && (
        <DeleteDeckDialog
          description={`Do you really want to remove ${selectedDeckData.name}? All cards will be deleted.`}
          itemName={'deck'}
          onConfirm={handleDelete}
          onOpenChange={handleClose}
          open={openedDialog === decksDialogList.deleteDeck}
          title={'Delete deck ?'}
        />
      )}
      {selectedDeckData && cardForLearnDialog && (
        <LearnDeckDialog
          card={cardForLearnDialog}
          disabled={cardGradeIsSubmitting}
          isLoading={cardToLearnFetching}
          isSuccess={cardGradeSubmitSuccessful}
          onOpenChange={handleClose}
          onSubmit={handleCardGradeSubmit}
          open={openedDialog === 'learn'}
          title={`Learn "${selectedDeckData.name}"`}
        />
      )}
    </>
  )
}
