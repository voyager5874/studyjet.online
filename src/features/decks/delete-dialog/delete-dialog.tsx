import type { AlertDialogProps } from '@radix-ui/react-alert-dialog'

import type { ReactNode } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Typography } from '@/ui/typography'

type Props = {
  description: string
  itemName?: string
  onCancel?: Function
  onConfirm?: Function
  title: string
  trigger?: ReactNode
} & AlertDialogProps
export const DeleteDeckDialog = ({
  title,
  itemName = 'item',
  description,
  trigger,
  onCancel,
  onConfirm,
  ...rest
}: Props) => {
  const handleConfirm = () => {
    onConfirm && onConfirm()
  }

  const handleCancel = () => {
    onCancel && onCancel()
  }

  return (
    <AlertDialog {...rest}>
      {trigger && <AlertDialogTrigger>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription asChild>
          <Typography variant={'subtitle2'}>{description}</Typography>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button onClick={handleCancel} variant={'secondary'}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm}>{`Delete ${itemName}`}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
