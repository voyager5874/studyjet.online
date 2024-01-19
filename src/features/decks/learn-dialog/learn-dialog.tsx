import type { LearnDeckFormData } from './learn-deck-form-schema'
import type { CardItem } from '@/features/cards'
import type { DialogProps } from '@radix-ui/react-dialog'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { AspectRatio } from '@/ui/aspect-ratio/aspect-ratio'
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { RadioGroup } from '@/ui/radio-group'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './learn-dialog.module.scss'

import { knowledgeQuality } from './const'
import { learnDeckFormSchema } from './learn-deck-form-schema'

export type LearnDeckDialogProps = {
  card: CardItem
  disabled?: boolean
  isLoading?: boolean
  isSuccess?: boolean
  onSubmit: (data: LearnDeckFormData) => void
  title: string
  trigger?: ReactNode
} & DialogProps
export function LearnDeckDialog(props: LearnDeckDialogProps) {
  const { isLoading, card, trigger, isSuccess, disabled, onSubmit, title, ...restProps } = props

  const [questionAsked, setQuestionAsked] = useState<boolean>(false)

  const form = useForm<LearnDeckFormData>({
    resolver: zodResolver(learnDeckFormSchema),
    defaultValues: {
      grade: '',
    },
  })

  const submitButtonDisabled =
    disabled ||
    form.formState.isSubmitting ||
    form.formState.isValidating ||
    form.getValues().grade === ''

  useEffect(() => {
    form.formState.isSubmitted && isSuccess && form.reset()
    // form.formState.isSubmitted && isSuccess && setQuestionAsked(false)
  }, [form, isSuccess])

  useEffect(() => {
    setQuestionAsked(false)
  }, [card.id])

  const classNames = {
    dialogContent: clsx(s.content),
    formSection: clsx(s.formSection),
    formItem: clsx(s.formItem),
    dialogHeader: clsx(s.dialogHeader),
    headerCloseButton: clsx(s.headerCloseButton),
    dialogFooter: clsx(s.dialogFooter, questionAsked && s.answerFooter),
    infoText: clsx(s.infoText),
    sectionTitle: clsx(s.sectionTitle),
  }

  return (
    <Dialog {...restProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...form}>
        <DialogContent className={classNames.dialogContent}>
          {!questionAsked && (
            <>
              <DialogHeader className={classNames.dialogHeader}>
                <Typography as={DialogTitle} variant={'large'}>
                  {title}
                </Typography>
                <DialogClose asChild>
                  <Button className={classNames.headerCloseButton} type={'button'} variant={'icon'}>
                    <X size={24} />
                  </Button>
                </DialogClose>
              </DialogHeader>
              <section className={classNames.formSection}>
                <Typography variant={'subtitle1'}>
                  Question:{' '}
                  <Typography as={'span'} variant={'body1'}>
                    {card.question}
                  </Typography>
                </Typography>
                <Typography className={classNames.infoText} variant={'body2'}>
                  Total number of views:{' '}
                  <Typography as={'span'} className={classNames.infoText} variant={'subtitle2'}>
                    {card.shots}
                  </Typography>
                </Typography>
                {card.questionImg && (
                  <AspectRatio
                    imageDescription={'question'}
                    ratio={500 / 200}
                    src={card.questionImg}
                  />
                )}
              </section>
              <DialogFooter className={classNames.dialogFooter}>
                <Button onClick={() => setQuestionAsked(true)} size={'fill'} type={'button'}>
                  Show answer
                </Button>
              </DialogFooter>
            </>
          )}
          {questionAsked && (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className={classNames.dialogHeader}>
                <Typography as={DialogTitle} variant={'large'}>
                  {title}
                </Typography>
                <DialogClose asChild>
                  <Button className={classNames.headerCloseButton} type={'button'} variant={'icon'}>
                    <X size={24} />
                  </Button>
                </DialogClose>
              </DialogHeader>

              <section className={classNames.formSection}>
                <Typography variant={'subtitle1'}>
                  Question:{' '}
                  <Typography as={'span'} variant={'body1'}>
                    {card.question}
                  </Typography>
                </Typography>

                <Typography className={classNames.infoText} variant={'body2'}>
                  Total number of views:{' '}
                  <Typography as={'span'} className={classNames.infoText} variant={'subtitle2'}>
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
              <section className={classNames.formSection}>
                <Typography className={classNames.sectionTitle} variant={'subtitle1'}>
                  Rate card info acquisition:
                </Typography>
                <FormField
                  control={form.control}
                  name={'grade'}
                  render={({ field }) => (
                    <FormItem className={classNames.formItem}>
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
              <DialogFooter className={classNames.dialogFooter}>
                <Button disabled={submitButtonDisabled} size={'fill'} type={'submit'}>
                  Next question
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Form>
    </Dialog>
  )
}

// function renderRadioGroup(field: ControllerRenderProps['field']) {
//   const classNames = {
//     formItem: clsx(s.formItem),
//   }
//
//   return (
//     <FormItem className={classNames.formItem}>
//       <FormControl>
//         <RadioGroup items={knowledgeQuality} onValueChange={field.onChange} value={field.value} />
//       </FormControl>
//     </FormItem>
//   )
// }
