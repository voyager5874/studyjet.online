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

  const [rateCardAcquisition] = useRateCardAcquisitionMutation()

  const previousSelectedDeckId = useRef<null | string>(null)

  const setPreviousSelectedDeckId = (id: null | string) => {
    previousSelectedDeckId.current = id
  }

  const [questionAsked, setQuestionAsked] = useState<boolean>(false)

  const {
    currentData: cardToLearnData,
    refetch: fetchNewCardToLearn,
    isFetching: cardToLeanFetching,
  } = useGetRandomCardFromDeckQuery(
    id
      ? {
          deckId: id,
          ...(previousSelectedDeckId.current && {
            previousCardId: previousSelectedDeckId.current,
          }),
        }
      : skipToken
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
        setPreviousSelectedDeckId(id)
        // formRef.current && formRef?.current?.reset()
        fetchNewCardToLearn()
          .unwrap()
          .then(() => setQuestionAsked(false))
      })
      .catch(() => {
        alert('error')
      })
  }

  const cn = {
    page: clsx(s.page),
    progress: clsx(s.progress),
    backLink: clsx(s.flexRow, s.backLink),
    card: clsx(s.card),
    formSection: clsx(s.formSection),
    formItem: clsx(s.formItem),
    cardHeader: clsx(s.cardHeader),
    cardFooter: clsx(s.cardFooter, questionAsked && s.answerFooter),
    infoText: clsx(s.infoText),
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
              <section className={cn.formSection}>
                <Typography variant={'subtitle1'}>
                  Question:{' '}
                  <Typography as={'span'} variant={'body1'}>
                    {cardToLearnData?.question}
                  </Typography>
                </Typography>
                <Typography className={cn.infoText} variant={'body2'}>
                  Total number of views:{' '}
                  <Typography as={'span'} className={cn.infoText} variant={'subtitle2'}>
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
                <Button onClick={() => setQuestionAsked(true)} size={'fill'} type={'button'}>
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
