import type { CreateDeckFormData } from '@/features/decks'
import type { DialogProps } from '@radix-ui/react-dialog'

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
import { X } from 'lucide-react'

import s from './create-deck-dialog.module.scss'

export type CreateDeckDialogProps = {
  /** item category i.e (card, deck ...) */
  onSubmit: (data: CreateDeckFormData) => void
  title: string
} & DialogProps
export function CreateDeckDialog(props: CreateDeckDialogProps) {
  const { onSubmit, title, ...restProps } = props

  const form = useForm<CreateDeckFormData>({
    defaultValues: {
      name: '',
      cover: ['', ''],
      isPrivate: false,
    },
  })

  return (
    <Dialog {...restProps} modal>
      <DialogTrigger asChild>
        <Button>Add new deck</Button>
      </DialogTrigger>
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextField label={'New deck name'} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'cover'}
                render={({ field }) => (
                  <FormItem className={s.imageInputContainer}>
                    <ImageInput
                      cropAspect={2.5}
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
              <Button type={'submit'}>Add new deck</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  )
}
