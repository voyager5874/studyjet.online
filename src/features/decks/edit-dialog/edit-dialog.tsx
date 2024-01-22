import type { DeckFormData } from './deck-form-schema'
import type { DeckItem } from '@/features/decks'
import type { DialogProps } from '@radix-ui/react-dialog'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
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
import { ImageInput } from '@/ui/image-input'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './edit-dialog.module.scss'

import { deckFormSchema } from './deck-form-schema'

export type EditDeckDialogProps = {
  deck?: DeckItem
  disabled?: boolean
  isSuccess?: boolean
  onSubmit: (data: DeckFormData) => void
  title: string
  trigger?: ReactNode
} & DialogProps
export function EditDeckDialog(props: EditDeckDialogProps) {
  const { deck, trigger, isSuccess, disabled, onSubmit, title, ...restProps } = props

  const form = useForm<DeckFormData>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      name: deck?.name || '',
      cover: ['', ''],
      isPrivate: deck?.isPrivate || false,
    },
  })

  const submitButtonDisabled =
    disabled || form.getValues().name === '' || form.formState.isValidating

  //todo: investigate 'useImperativeHandle' hook for exposing .reset()
  //todo: check for accessibility (id, aria-labels...)
  //todo: if name is '' (create dialog), focus corresponding TextField

  useEffect(() => {
    form.formState.isSubmitted && isSuccess && form.reset()
  }, [form, isSuccess])

  const classNames = {
    dialogContent: clsx(s.content),
    formSection: clsx(s.formSection),
    formItem: clsx(s.formItem),
    dialogFooter: clsx(s.dialogFooter),
  }

  return (
    <Dialog {...restProps} modal>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...form}>
        <DialogContent asChild className={classNames.dialogContent}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <Typography as={DialogTitle} variant={'h2'}>
                {title}
              </Typography>
              <DialogClose asChild>
                <Button type={'button'} variant={'icon'}>
                  <X size={24} />
                </Button>
              </DialogClose>
            </DialogHeader>
            <section className={classNames.formSection}>
              <FormField
                control={form.control}
                name={'name'}
                render={({ field, fieldState }) => (
                  <FormItem className={classNames.formItem}>
                    <FormControl>
                      <TextField
                        label={'New deck name'}
                        {...field}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'cover'}
                render={({ field, fieldState }) => (
                  <FormItem className={classNames.formItem}>
                    <ImageInput
                      cropAspect={2.5}
                      defaultImage={deck?.cover}
                      errorMessage={fieldState.error?.message}
                      itemName={'cover'}
                      name={'cover'}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={'isPrivate'}
                render={({ field }) => (
                  <FormItem className={classNames.formItem}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        label={'Do not share this deck'}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>
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
