import type { LearnDeckFormData } from '@/features/decks/learn-dialog/learn-deck-form-schema'

import { useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { useGetRandomCardFromDeckQuery, useRateCardAcquisitionMutation } from '@/features/cards/api'
import { useGetDeckByIdQuery } from '@/features/decks/api'
import { GradeSubmitForm } from '@/features/decks/grade-submit-form'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Typography } from '@/ui/typography'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'
import { LucideArrowLeft } from 'lucide-react'

import s from './page.module.scss'

export const Page = () => {
  const { id } = useParams<{ id: string }>()
  const {
    state: { referer },
  } = useLocation()

  const { data: currentDeckData } = useGetDeckByIdQuery(id ?? skipToken)

  const [rateCardAcquisition, { isLoading: cardGradeSubmitting }] = useRateCardAcquisitionMutation()

  const previousCardId = useRef<null | string>(null)

  const [questionAsked, setQuestionAsked] = useState<boolean>(false)

  const { currentData: cardToLearnData, isFetching: cardToLeanFetching } =
    useGetRandomCardFromDeckQuery(
      getParamsForUseGetRandomCardQuery({
        deckId: id,
        previousCardId: previousCardId.current,
      })
    )

  const formRef = useRef<HTMLFormElement>(null)

  const handleCardGradeSubmit = (data: LearnDeckFormData) => {
    if (!id || !cardToLearnData) {
      return
    }

    const gradeAsNumber = Number.parseInt(data.grade)

    if (!gradeAsNumber) {
      return
    }

    rateCardAcquisition({
      body: { cardId: cardToLearnData.id, grade: gradeAsNumber },
      deckId: id,
    })
      .unwrap()
      .then(() => {
        setQuestionAsked(false)
        previousCardId.current = cardToLearnData.id

        // formRef.current && formRef?.current?.reset()
      })
      .catch(() => {
        alert('error')
      })
  }

  const handleShowAnswer = () => {
    if (!cardToLearnData) {
      return
    }
    setQuestionAsked(true)
  }

  const cn = {
    page: clsx(s.page),
    progress: clsx(s.progress),
    backLink: clsx(s.flexRow, s.backLink),
    card: clsx(s.card),
    cardSection: clsx(s.cardSection),
    cardHeader: clsx(s.cardHeader),
    cardFooter: clsx(s.cardFooter),
    shotsCountText: clsx(s.shotsCountText),
    shotsCountNumber: clsx(s.subduedText),
    sectionTitle: clsx(s.sectionTitle),
    cardPlaceholder: clsx(s.cardPlaceholder),
  }

  return (
    <>
      <ProgressBar className={cn.progress} show={cardToLeanFetching} />

      <div className={cn.page}>
        <Link className={cn.backLink} replace to={referer ? `../${referer}` : '/decks'}>
          <LucideArrowLeft size={16} />

          <Typography variant={'body2'}>
            Back to the{' '}
            {referer.endsWith('cards') ? `cards of "${currentDeckData?.name}"` : 'decks page'}
          </Typography>
        </Link>
        <Card className={cn.card}>
          {!questionAsked && !cardToLeanFetching && (
            <>
              <div className={cn.cardHeader}>
                <Typography variant={'large'}>
                  {`Learn "${currentDeckData?.name || 'unknown deck'}"`}
                </Typography>
              </div>
              <section className={cn.cardSection}>
                <Typography variant={'subtitle1'}>
                  Question:{' '}
                  <Typography as={'span'} variant={'body1'}>
                    {cardToLearnData?.question}
                  </Typography>
                </Typography>
                <Typography className={cn.shotsCountText} variant={'body2'}>
                  Total number of views:{' '}
                  <Typography as={'span'} className={cn.shotsCountNumber} variant={'subtitle2'}>
                    {cardToLearnData?.shots}
                  </Typography>
                </Typography>
                {cardToLearnData?.questionImg && (
                  <AspectRatio
                    imageDescription={'question'}
                    ratio={500 / 200}
                    src={cardToLearnData?.questionImg}
                  />
                )}
              </section>
              <div className={cn.cardFooter}>
                <Button onClick={handleShowAnswer} size={'fill'} type={'button'}>
                  Show answer
                </Button>
              </div>
            </>
          )}
          {!questionAsked && cardToLeanFetching && <div className={cn.cardPlaceholder} />}
          {questionAsked && (
            <>
              <div className={cn.cardHeader}>
                <Typography variant={'large'}>
                  {`Learn "${currentDeckData?.name || 'unknown deck'}"`}
                </Typography>
              </div>

              <GradeSubmitForm
                card={cardToLearnData}
                disabled={cardGradeSubmitting}
                onSubmit={handleCardGradeSubmit}
                ref={formRef}
              />
            </>
          )}
        </Card>
      </div>
    </>
  )
}

function getParamsForUseGetRandomCardQuery(data: {
  deckId: null | string | undefined
  lastQuery?: { deckId: string; previousCardId?: string } | null
  previousCardId: null | string | undefined
}) {
  const { deckId, previousCardId } = data

  if (!deckId) {
    return skipToken
  }

  if (!previousCardId) {
    return { deckId }
  }

  return { deckId, previousCardId }
}
