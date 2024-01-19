import type { LearnDeckFormData } from '@/features/decks/learn-dialog/learn-deck-form-schema'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useGetRandomCardFromDeckQuery, useRateCardAcquisitionMutation } from '@/features/cards/api'
import { useGetDeckByIdQuery } from '@/features/decks/api'
import { knowledgeQuality } from '@/features/decks/learn-dialog/const'
import { learnDeckFormSchema } from '@/features/decks/learn-dialog/learn-deck-form-schema'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { RadioGroup } from '@/ui/radio-group'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { skipToken } from '@reduxjs/toolkit/query'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const { id } = useParams<{ id: string }>()
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

  const form = useForm<LearnDeckFormData>({
    resolver: zodResolver(learnDeckFormSchema),
    defaultValues: {
      grade: '',
    },
  })

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
        // alert('success')
        setPreviousSelectedDeckId(id)
        fetchNewCardToLearn()
          .unwrap()
          .then(() => setQuestionAsked(false))
      })
      .catch(() => {
        alert('error')
      })
  }
  const submitButtonDisabled =
    form.formState.isSubmitting || form.formState.isValidating || form.getValues().grade === ''

  const cn = {
    page: clsx(s.page),
    card: clsx(s.content),
    formSection: clsx(s.formSection),
    formItem: clsx(s.formItem),
    cardHeader: clsx(s.dialogHeader),
    headerCloseButton: clsx(s.headerCloseButton),
    cardFooter: clsx(s.footer, questionAsked && s.answerFooter),
    infoText: clsx(s.infoText),
    sectionTitle: clsx(s.sectionTitle),
    cardPlaceholder: clsx(s.cardPlaceholder),
  }

  return (
    <>
      <ProgressBar className={clsx(s.progress)} show={cardToLeanFetching} />

      <div className={cn.page}>
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
          <Form {...form}>
            {questionAsked && (
              <form onSubmit={form.handleSubmit(handleCardGradeSubmit)}>
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

                  <Typography variant={'subtitle1'}>
                    Answer:{' '}
                    <Typography as={'span'} variant={'body1'}>
                      {cardToLearnData?.answer}
                    </Typography>
                  </Typography>
                  {cardToLearnData?.answerImg && (
                    <AspectRatio
                      imageDescription={'answer'}
                      ratio={500 / 200}
                      src={cardToLearnData?.answerImg}
                    />
                  )}
                </section>
                <section className={cn.formSection}>
                  <Typography className={cn.sectionTitle} variant={'subtitle1'}>
                    Rate card info acquisition:
                  </Typography>
                  <FormField
                    control={form.control}
                    name={'grade'}
                    render={({ field }) => (
                      <FormItem className={cn.formItem}>
                        <FormControl>
                          <RadioGroup
                            items={knowledgeQuality}
                            onValueChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </section>
                <div className={cn.cardFooter}>
                  <Button disabled={submitButtonDisabled} size={'fill'} type={'submit'}>
                    Next question
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </Card>
      </div>
    </>
  )
}
