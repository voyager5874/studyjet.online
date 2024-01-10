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
  onCancel?: Function
  onConfirm?: Function
  trigger?: ReactNode
} & AlertDialogProps
export const DeleteCardDialog = ({ trigger, onCancel, onConfirm, ...rest }: Props) => {
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription asChild>
          <Typography variant={'subtitle2'}>
            This action cannot be undone. This will permanently delete the card and remove your data
            from our servers.
          </Typography>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button onClick={handleCancel} variant={'secondary'}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm}>Proceed</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
