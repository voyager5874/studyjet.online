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
    disabled ||
    form.formState.isSubmitting ||
    form.getValues().name === '' ||
    form.formState.isValidating

  //todo: investigate 'useImperativeHandle' hook for exposing .reset()
  useEffect(() => {
    form.formState.isSubmitted && isSuccess && form.reset()
  }, [form, isSuccess])

  // todo: use 'classNames' object
  return (
    <Dialog {...restProps} modal>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...form}>
        <DialogContent asChild className={s.content}>
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
            <section className={s.essence}>
              <FormField
                control={form.control}
                name={'name'}
                render={({ field, fieldState }) => (
                  <FormItem>
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
                  <FormItem className={s.imageInputContainer}>
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
                  <FormItem>
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
            <DialogFooter>
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
