import type { CardItem } from '@/features/cards'
import type { LearnDeckFormData } from '@/features/decks/learn-dialog/learn-deck-form-schema'

import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'

import { knowledgeQuality } from '@/features/decks/learn-dialog/const'
import { learnDeckFormSchema } from '@/features/decks/learn-dialog/learn-deck-form-schema'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { RadioGroup } from '@/ui/radio-group'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'

import s from './grade-submit-form.module.scss'

export type GradeSubmitFormProps = {
  card?: CardItem
  disabled?: boolean
  isSubmitting?: boolean
  isSuccess?: boolean
  onSubmit: (data: LearnDeckFormData) => void
} & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>
export const GradeSubmitForm = forwardRef<HTMLFormElement, GradeSubmitFormProps>(
  (props: GradeSubmitFormProps, forwardedRef) => {
    const { isSubmitting, card, isSuccess, disabled, onSubmit, title, ...restProps } = props

    const form = useForm<LearnDeckFormData>({
      resolver: zodResolver(learnDeckFormSchema),
      defaultValues: {
        grade: '',
      },
    })

    useImperativeHandle(
      forwardedRef,
      () =>
        ({
          // ...forwardedRef?.current,
          reset: () => {
            form.reset()
          },
        }) as HTMLFormElement
    )

    useEffect(() => {
      form.formState.isSubmitted && isSuccess && form.reset()
    }, [form, isSuccess])

    // submitting is 'synchronous' for the form
    // so "isSubmitting" is almost immediately false - "isSubmitted" could be used

    const formDisabled = disabled || isSubmitting || form.formState.isValidating

    const submitButtonDisabled = formDisabled || form.getValues().grade === ''

    const cn = {
      formSection: clsx(s.formSection),
      formItem: clsx(s.formItem),
      footer: clsx(s.footer),
      shotsCount: clsx(s.shotsCount),
      sectionTitle: clsx(s.sectionTitle),
    }

    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} {...restProps} ref={forwardedRef}>
            {card && (
              <section className={cn.formSection}>
                <Typography variant={'subtitle1'}>
                  Question:{' '}
                  <Typography as={'span'} variant={'body1'}>
                    {card.question}
                  </Typography>
                </Typography>

                <Typography className={cn.shotsCount} variant={'body2'}>
                  Total number of views:{' '}
                  <Typography as={'span'} className={cn.shotsCount} variant={'subtitle2'}>
                    {card.shots}
                  </Typography>
                </Typography>

                <Typography variant={'subtitle1'}>
                  Answer:{' '}
                  <Typography as={'span'} variant={'body1'}>
                    {card.answer}
                  </Typography>
                </Typography>
                {card.answerImg && (
                  <AspectRatio imageDescription={'answer'} ratio={500 / 200} src={card.answerImg} />
                )}
              </section>
            )}
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
                        disabled={formDisabled}
                        items={knowledgeQuality}
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>
            <section className={cn.footer}>
              <Button disabled={submitButtonDisabled} size={'fill'} type={'submit'}>
                Next question
              </Button>
            </section>
          </form>
        </Form>
      </>
    )
  }
)
