import type { DeckFormData } from './deck-form-schema'
import type { DeckItem } from '@/features/decks'
import type { DialogProps } from '@radix-ui/react-dialog'

import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/ui/button'
import { CustomCheckbox } from '@/ui/custom-checkbox/custom-checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import { CardAndDeckImageSelector } from '@/ui/image-input/card-and-deck-image-selector'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './edit-dialog.module.scss'

import { deckFormSchema } from './deck-form-schema'

export type EditDeckDialogProps = {
  deck?: DeckItem
  disabled?: boolean
  onSubmit: (data: DeckFormData) => Promise<void>
  title: string
  trigger?: ReactNode
} & DialogProps
export function EditDeckDialog(props: EditDeckDialogProps) {
  const { deck, trigger, disabled, onSubmit, title, ...restProps } = props

  const { register, ...form } = useForm<DeckFormData>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      name: deck?.name || '',
      cover: '',
      isPrivate: deck?.isPrivate || false,
    },
  })

  const submitButtonDisabled =
    disabled || form.formState.isValidating || Boolean(form.formState?.errors?.name)

  //todo: check for accessibility (id, aria-labels...)
  //todo: if name is '' (create dialog), focus corresponding TextField

  const handleSubmit = async (data: DeckFormData) => {
    onSubmit(data)
      .then(() => form.reset())
      .catch(err => console.warn(err))
  }

  const cn = {
    dialogContent: clsx(s.content),
    formSection: clsx(s.formSection),
    formItem: clsx(s.formItem),
  }

  return (
    <>
      {import.meta.env.DEV && <DevTool control={form.control} />}
      <Dialog {...restProps} modal>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent asChild className={cn.dialogContent}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
            <section className={cn.formSection}>
              <div className={cn.formItem}>
                <TextField
                  errorMessage={form.formState.errors.name?.message}
                  label={'New deck name'}
                  {...register('name')}
                />
              </div>
              <div className={cn.formItem}>
                <CardAndDeckImageSelector
                  errorMessage={form.formState.errors.cover?.message}
                  initialContent={deck?.cover || undefined}
                  triggerText={deck?.cover ? 'change cover image' : 'add cover image'}
                  {...register('cover')}
                />
              </div>
              <div className={cn.formItem}>
                <CustomCheckbox
                  label={'Do not share this deck'}
                  {...register('isPrivate')}
                  defaultChecked={deck?.isPrivate || false}
                />
              </div>
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
      </Dialog>
    </>
  )
}
