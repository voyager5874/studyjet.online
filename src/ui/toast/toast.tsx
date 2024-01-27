import type { ComponentPropsWithoutRef, ElementRef, ReactElement } from 'react'
import { forwardRef } from 'react'

import * as ToastPrimitives from '@radix-ui/react-toast'
import { type VariantProps, cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import s from './toast.module.scss'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitives.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport className={clsx(s.viewport, className)} ref={ref} {...props} />
))

ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(s.toastBase, {
  variants: {
    variant: {
      default: s.defaultToast,
      warning: s.warningToast,
      info: s.infoToast,
      danger: s.dangerToast,
      dangerColored: s.dangerToastColored,
      success: s.successToast,
      successColored: s.successToastColored,
    },
    from: {
      left: s.fromLeft,
      right: s.fromRight,
      bottom: s.fromBottom,
      auto: s.autoFrom,
      top: s.fromTop,
    },
    position: {
      topCenter: s.topCenter,
      topLeft: s.topLeft,
      topRight: s.topRight,
      bottomCenter: s.bottomCenter,
      bottomLeft: s.bottomLeft,
      bottomRight: s.bottomRight,
      auto: s.autoPosition,
    },
  },
  defaultVariants: {
    variant: 'default',
    from: 'auto',
    position: 'auto',
  },
})

type ToastProps = {
  description?: string
} & VariantProps<typeof toastVariants> &
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root>

const Toast = forwardRef<ElementRef<typeof ToastPrimitives.Root>, ToastProps>(
  ({ className, variant, from, position, ...props }, ref) => {
    return (
      <ToastPrimitives.Root
        className={clsx(toastVariants({ variant, from, position }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitives.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action className={clsx(s.toastAction, className)} ref={ref} {...props} />
))

ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitives.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    aria-label={'Close'}
    className={clsx(s.toastClose, className)}
    ref={ref}
    {...props}
  >
    <X size={16} />
  </ToastPrimitives.Close>
))

ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title className={clsx(s.toastTitle, className)} ref={ref} {...props} />
))

ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    className={clsx(s.toastDescription, className)}
    ref={ref}
    {...props}
  />
))

ToastDescription.displayName = ToastPrimitives.Description.displayName

// type ToastProps = ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
}
