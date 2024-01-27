'use client'

import type { ComponentPropsWithoutRef } from 'react'

import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './toast.module.scss'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'
import { useToast } from './use-toast'

// type Props = ComponentPropsWithoutRef<typeof ToastProvider> & ComponentPropsWithoutRef<typeof Toast>
type Props = {
  onOpenChange?: (open: boolean, id: number | string) => void
} & ComponentPropsWithoutRef<typeof ToastProvider>
export function Toaster(toasterProps: Props) {
  const {
    onOpenChange,
    swipeThreshold = 100,
    swipeDirection = 'right',
    ...restProps
  } = toasterProps
  const { toasts } = useToast()

  const handleChangeOpen = (open: boolean, id: number | string) => {
    toasterProps.onOpenChange && toasterProps.onOpenChange(open, id)
  }

  const cn = {
    toast: clsx(
      swipeDirection === 'right' && s.swipeRightClose,
      swipeDirection === 'left' && s.swipeLeftClose,
      swipeDirection === 'up' && s.swipeUpClose,
      swipeDirection === 'down' && s.swipeDownClose
    ),
  }

  return (
    <ToastProvider {...restProps} swipeDirection={swipeDirection} swipeThreshold={swipeThreshold}>
      {toasts.map(function ({ id, title, description, action, onOpenChange, className, ...props }) {
        return (
          <Toast
            key={id}
            onOpenChange={open => {
              handleChangeOpen(open, id)
              onOpenChange && onOpenChange(open)
            }}
            {...props}
            className={clsx(cn.toast, className)}
          >
            <div className={clsx(s.toastContent)}>
              {title && (
                <Typography as={ToastTitle} className={clsx(s.toastTitle)} variant={'subtitle1'}>
                  {title}
                </Typography>
              )}
              {description && (
                <Typography
                  as={ToastDescription}
                  className={clsx(s.toastDescription)}
                  variant={'body2'}
                >
                  {description}
                </Typography>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
