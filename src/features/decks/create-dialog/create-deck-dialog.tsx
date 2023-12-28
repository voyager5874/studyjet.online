import type { CreateDeckData } from '@/features/decks/create-dialog/create-deck-form-schema'
import type { DialogProps } from '@radix-ui/react-dialog'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { createDeckFormSchema } from '@/features/decks/create-dialog/create-deck-form-schema'
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

import s from './create-deck-dialog.module.scss'

export type CreateDeckDialogProps = {
  disabled?: boolean
  isSuccess?: boolean
  onSubmit: (data: CreateDeckData) => void
  title: string
  trigger?: ReactNode
} & DialogProps
export function CreateDeckDialog(props: CreateDeckDialogProps) {
  const { trigger, isSuccess, disabled, onSubmit, title, ...restProps } = props

  const form = useForm<CreateDeckData>({
    resolver: zodResolver(createDeckFormSchema),
    defaultValues: {
      name: '',
      cover: ['', ''],
      isPrivate: false,
    },
  })

  const submitButtonDisabled =
    disabled ||
    form.formState.isSubmitting ||
    form.getValues().name === '' ||
    form.formState.isValidating

  useEffect(() => {
    form.formState.isSubmitted && isSuccess && form.reset()
  }, [form, isSuccess])

  return (
    <Dialog {...restProps} modal>
      <DialogTrigger asChild>{trigger ? trigger : <Button>Add new deck</Button>}</DialogTrigger>
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
              <Button type={'button'} variant={'secondary'}>
                Cancel
              </Button>
              <Button disabled={submitButtonDisabled} type={'submit'}>
                Add new deck
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  )
}
