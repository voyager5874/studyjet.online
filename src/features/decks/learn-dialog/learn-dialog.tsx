import type { CardItem } from '@/features/cards'
import type { GradeSubmitFormProps } from '@/features/decks/grade-submit-form'
import type { DialogProps } from '@radix-ui/react-dialog'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { GradeSubmitForm } from '@/features/decks/grade-submit-form'
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
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './learn-dialog.module.scss'

export type LearnDeckDialogProps = {
  card: CardItem
  isLoading?: boolean
  onShowAnswer?: () => void
  title: string
  trigger?: ReactNode
} & DialogProps &
  GradeSubmitFormProps
export function LearnDeckDialog(props: LearnDeckDialogProps) {
  const {
    isSubmitting,
    onShowAnswer,
    isLoading,
    card,
    trigger,
    isSuccess,
    disabled,
    onSubmit,
    title,
    ...restProps
  } = props

  const [questionAsked, setQuestionAsked] = useState<boolean>(false)

  useEffect(() => {
    // if there is only one  card in a deck this won't work
    setQuestionAsked(false)
  }, [card.id])

  const showAnswer = () => {
    onShowAnswer && onShowAnswer()
    setQuestionAsked(true)
  }

  const classNames = {
    dialogContent: clsx(s.content),
    formSection: clsx(s.formSection),
    formItem: clsx(s.formItem),
    dialogHeader: clsx(s.dialogHeader),
    headerCloseButton: clsx(s.headerCloseButton),
    dialogFooter: clsx(s.dialogFooter),
    shotsCount: clsx(s.shotsCount),
    sectionTitle: clsx(s.sectionTitle),
  }

  return (
    <Dialog {...restProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
              <Typography className={classNames.shotsCount} variant={'body2'}>
                Total number of views:{' '}
                <Typography as={'span'} className={clsx(s.subduedText)} variant={'subtitle2'}>
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
              <Button onClick={showAnswer} size={'fill'} type={'button'}>
                Show answer
              </Button>
            </DialogFooter>
          </>
        )}
        {questionAsked && (
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

            <GradeSubmitForm card={card} disabled={disabled || isSubmitting} onSubmit={onSubmit} />
          </>
        )}
      </DialogContent>
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
