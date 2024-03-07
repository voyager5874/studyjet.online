import type { CardFormData } from './card-form-schema'
import type { CardItem } from '@/features/cards'
import type { DialogProps } from '@radix-ui/react-dialog'

import type { ReactNode } from 'react'
import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { TextArea } from '@/ui/text-area'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './edit-dialog.module.scss'

import { cardFormSchema } from './card-form-schema'

export type EditCardDialogProps = {
  card?: CardItem
  disabled?: boolean
  onSubmit: (data: CardFormData) => Promise<void>
  title: string
  trigger?: ReactNode
} & DialogProps
export function EditCardDialog(props: EditCardDialogProps) {
  const { card, trigger, disabled, onSubmit, title, ...restProps } = props

  const [currentTab, setCurrentTab] = useState('question')

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

  const handleSubmit = async (data: CardFormData) => {
    onSubmit(data)
      .then(() => form.reset())
      .catch(err => console.warn(err))
  }

  const handleTabChange = (tab: string) => {
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  const cn = {
    formSection: clsx(s.formSection),
    questionSection: clsx(s.formSection, currentTab !== 'question' && s.hidden),
    answerSection: clsx(s.formSection, currentTab !== 'answer' && s.hidden),
    dialogContent: clsx(s.content),
    dialogHeader: clsx(s.dialogHeader),
    dialogFooter: clsx(s.dialogFooter),
    formItem: clsx(s.formItem),
    tabs: clsx(s.tabs),
    tabsList: clsx(s.tabsList),
    tabsTrigger: clsx(s.tabsTrigger),
    underline: clsx(s.underline),
  }

  return (
    <Dialog {...restProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...form}>
        <DialogContent asChild className={cn.dialogContent}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className={cn.dialogHeader}>
              <Typography as={DialogTitle} variant={'h2'}>
                {title}
              </Typography>
              <DialogClose asChild>
                <Button type={'button'} variant={'icon'}>
                  <X size={24} />
                </Button>
              </DialogClose>
            </DialogHeader>
            <Tabs className={cn.tabs} onValueChange={handleTabChange} value={currentTab}>
              <TabsList className={cn.tabsList}>
                <TabsTrigger className={cn.tabsTrigger} value={'question'}>
                  Question
                </TabsTrigger>
                <TabsTrigger className={cn.tabsTrigger} value={'answer'}>
                  Answer
                </TabsTrigger>
              </TabsList>
              <TabsContent asChild forceMount value={'question'}>
                <section className={cn.questionSection}>
                  <FormField
                    control={form.control}
                    name={'question'}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <TextArea
                            label={'question'}
                            {...field}
                            autoHeight
                            errorMessage={fieldState.error?.message}
                            maxHeight={200}
                            onValueChange={field.onChange}
                            rows={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={'questionImg'}
                    render={({ field, fieldState }) => (
                      <FormItem className={cn.formItem}>
                        <CardAndDeckImageSelector
                          errorMessage={fieldState.error?.message}
                          initialContent={card?.questionImg || undefined}
                          name={'questionImg'}
                          onValueChange={field.onChange}
                          triggerText={
                            card?.questionImg ? 'change question image' : 'add question image'
                          }
                          value={field.value}
                        />
                      </FormItem>
                    )}
                  />
                </section>
              </TabsContent>
              <TabsContent asChild forceMount value={'answer'}>
                <section className={cn.answerSection}>
                  <FormField
                    control={form.control}
                    name={'answer'}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <TextArea
                            label={'answer'}
                            {...field}
                            autoHeight
                            errorMessage={fieldState.error?.message}
                            maxHeight={200}
                            onValueChange={field.onChange}
                            rows={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={'answerImg'}
                    render={({ field, fieldState }) => (
                      <FormItem className={cn.formItem}>
                        <CardAndDeckImageSelector
                          errorMessage={fieldState.error?.message}
                          initialContent={card?.answerImg || undefined}
                          name={'answerImg'}
                          onValueChange={field.onChange}
                          triggerText={card?.answerImg ? 'change answer image' : 'add answer image'}
                          value={field.value}
                        />
                      </FormItem>
                    )}
                  />
                </section>
              </TabsContent>
            </Tabs>

            <DialogFooter className={cn.dialogFooter}>
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
