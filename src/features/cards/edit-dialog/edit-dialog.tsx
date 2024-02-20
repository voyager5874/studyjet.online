import type { CardFormData } from './card-form-schema'
import type { CardItem } from '@/features/cards'
import type { DialogProps } from '@radix-ui/react-dialog'
import type { Point } from 'react-easy-crop'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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
import { CardAndDeckImageSelector } from '@/ui/image-input/card-and-deck-image-selector'
import { ZERO_POINT } from '@/ui/image-input/const'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './edit-dialog.module.scss'

import { cardFormSchema } from './card-form-schema'

export type EditCardDialogProps = {
  card?: CardItem
  disabled?: boolean
  isSuccess?: boolean
  onSubmit: (data: CardFormData) => void
  title: string
  trigger?: ReactNode
} & DialogProps
export function EditCardDialog(props: EditCardDialogProps) {
  const { card, trigger, isSuccess, disabled, onSubmit, title, ...restProps } = props

  const [questionSourceImg, setQuestionSourceImg] = useState<string>('')
  const [questionImgCenterPoint, setQuestionImgCenterPoint] = useState<Point>(ZERO_POINT)
  const [questionImgZoom, setQuestionImgZoom] = useState<number>(1)

  const [answerSourceImg, setAnswerSourceImg] = useState<string>('')
  const [answerImgCropCenterPoint, setAnswerImgCropCenterPoint] = useState<Point>(ZERO_POINT)
  const [answerImgZoom, setAnswerImgZoom] = useState<number>(1)

  const form = useForm({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      question: card?.question || '',
      answer: card?.answer || '',
      questionImg: '',
      answerImg: '',
    },
  })

  const submitButtonDisabled =
    disabled ||
    form.getValues().answer === '' ||
    form.getValues().question === '' ||
    form.formState.isValidating

  //todo: check for accessibility (id, aria-labels...)
  //todo: if name is '' (create dialog), focus corresponding TextField

  useEffect(() => {
    form.formState.isSubmitted && isSuccess && form.reset()
  }, [form, isSuccess])

  const classNames = {
    formSection: clsx(s.formSection),
    dialogContent: clsx(s.content),
    dialogHeader: clsx(s.dialogHeader),
    dialogFooter: clsx(s.dialogFooter),
    formItem: clsx(s.formItem),
    tabs: clsx(s.tabs),
    tabsList: clsx(s.tabsList),
    tabsTrigger: clsx(s.tabsTrigger),
    underline: clsx(s.underline),
  }

  console.log({
    form,
    questionSourceImg,
    questionImgCenterPoint,
    questionImgZoom,
    question: form.getValues('question'),
  })

  return (
    <Dialog {...restProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...form}>
        <DialogContent asChild className={classNames.dialogContent}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className={classNames.dialogHeader}>
              <Typography as={DialogTitle} variant={'h2'}>
                {title}
              </Typography>
              <DialogClose asChild>
                <Button type={'button'} variant={'icon'}>
                  <X size={24} />
                </Button>
              </DialogClose>
            </DialogHeader>
            <Tabs className={classNames.tabs} defaultValue={'question'}>
              <TabsList className={classNames.tabsList}>
                <TabsTrigger className={classNames.tabsTrigger} value={'question'}>
                  Question
                </TabsTrigger>
                <TabsTrigger className={classNames.tabsTrigger} value={'answer'}>
                  Answer
                </TabsTrigger>
              </TabsList>
              <TabsContent value={'question'}>
                <section className={classNames.formSection}>
                  <FormField
                    control={form.control}
                    name={'question'}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <TextField
                            label={'question'}
                            {...field}
                            errorMessage={fieldState.error?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={'questionImg'}
                    render={({ field, fieldState }) => (
                      <FormItem className={classNames.formItem}>
                        <CardAndDeckImageSelector
                          centerPoint={questionImgCenterPoint}
                          errorMessage={fieldState.error?.message}
                          initialContent={card?.questionImg || undefined}
                          name={'questionImg'}
                          onCropCenterChange={setQuestionImgCenterPoint}
                          onSourceImageChange={setQuestionSourceImg}
                          onValueChange={field.onChange}
                          onZoomChange={setQuestionImgZoom}
                          sourceImage={questionSourceImg}
                          triggerText={
                            card?.questionImg ? 'change question image' : 'add question image'
                          }
                          value={field.value}
                          zoomValue={questionImgZoom}
                        />
                      </FormItem>
                    )}
                  />
                </section>
              </TabsContent>
              <TabsContent value={'answer'}>
                <section className={classNames.formSection}>
                  <FormField
                    control={form.control}
                    name={'answer'}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <TextField
                            label={'answer'}
                            {...field}
                            errorMessage={fieldState.error?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={'answerImg'}
                    render={({ field, fieldState }) => (
                      <FormItem className={classNames.formItem}>
                        <CardAndDeckImageSelector
                          centerPoint={answerImgCropCenterPoint}
                          errorMessage={fieldState.error?.message}
                          initialContent={card?.answerImg || undefined}
                          name={'answerImg'}
                          onCropCenterChange={setAnswerImgCropCenterPoint}
                          onSourceImageChange={setAnswerSourceImg}
                          onValueChange={field.onChange}
                          onZoomChange={setAnswerImgZoom}
                          sourceImage={answerSourceImg}
                          triggerText={card?.answerImg ? 'change answer image' : 'add answer image'}
                          value={field.value}
                          zoomValue={answerImgZoom}
                        />
                      </FormItem>
                    )}
                  />
                </section>
              </TabsContent>
            </Tabs>

            <DialogFooter className={classNames.dialogFooter}>
              <DialogClose asChild>
                <Button type={'button'} variant={'secondary'}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={submitButtonDisabled} type={'submit'}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  )
}
