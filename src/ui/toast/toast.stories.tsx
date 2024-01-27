import type { Meta, StoryObj } from '@storybook/react'

import { useRef, useState } from 'react'

import { flexCenter } from '@/common/flex-center'
import { Button } from '@/ui/button'
import { Toaster } from '@/ui/toast/toaster'
import { useToast } from '@/ui/toast/use-toast'
import { getToastSwipeDirection } from '@/ui/toast/utils'
import { faker } from '@faker-js/faker'
import { useArgs } from '@storybook/preview-api'

import s from './toast.module.scss'

import { Typography } from '../typography'
import { Toast, ToastAction, ToastClose, ToastProvider, ToastTitle, ToastViewport } from './toast'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        'default',
        'warning',
        'info',
        'danger',
        'dangerColored',
        'success',
        'successColored',
      ],
      control: 'radio',
    },
    from: {
      control: 'radio',
      options: ['left', 'right', 'top', 'bottom', 'auto'],
    },
    position: {
      control: 'radio',
      options: [
        'bottomLeft',
        'bottomRight',
        'auto',
        'topLeft',
        'topRight',
        'topCenter',
        'bottomCenter',
      ],
    },
    duration: {
      control: 'number',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

const Template: Story = {
  render: args => {
    const { toast, toasts, dismiss } = useToast()

    const [open, setOpen] = useState(false)

    const infoToastContent = useRef('')

    const triggerToast = () => {
      toast({
        title: `${faker.word.adjective()} ${faker.word.noun()}`,
        description: faker.lorem.sentence(5),
        variant: 'successColored',
        duration: 10000,
        ...args,
      })
    }

    const dismissRecentToast = () => {
      if (!toasts.length) {
        return
      }

      dismiss(toasts[0].id)
    }

    const handleOpenChange = (open: boolean, id: number | string) => {
      if (!open) {
        infoToastContent.current = `${id} dismissed by itself (timer or close button)`
        setOpen(true)
      }
    }

    const onInfoToastOpenChange = (open: boolean) => {
      infoToastContent.current = ''

      setOpen(open)
    }

    return (
      <div style={{ height: '400px', border: '1px solid var(--color-border)' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button onClick={triggerToast}>Trigger new toast</Button>

          <Button disabled={!toasts?.length} onClick={dismissRecentToast}>
            Dismiss {Boolean(toasts?.length) && toasts[0].title}
          </Button>
        </div>
        <ul style={{ ...flexCenter, gap: '20px', justifySelf: 'flex-end' }}>
          {toasts.map(item => (
            <li key={item.id}>
              <Typography as={'span'} variant={'caption'}>
                {item.title}
              </Typography>
              {/*{' '}*/}
              {/*<Typography as={'span'} variant={'caption'}>*/}
              {/*  {item.id}*/}
              {/*</Typography>*/}
            </li>
          ))}
        </ul>
        <Toaster
          onOpenChange={handleOpenChange}
          swipeDirection={getToastSwipeDirection(args?.position)}
          swipeThreshold={200}
        />
        <ToastProvider>
          <Toast
            duration={1000}
            from={'auto'}
            onOpenChange={onInfoToastOpenChange}
            open={open}
            position={args?.position?.includes('top') ? 'bottomCenter' : 'topCenter'}
            variant={'info'}
          >
            <ToastTitle>{infoToastContent.current}</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      </div>
    )
  },
}

export const Overview: Story = {
  ...Template,
  args: {},
}

const TemplateSimple: Story = {
  args: {
    title: 'title',
    open: true,
    duration: 1000000,
    position: 'topCenter',
  },
  render: args => {
    const [_, setArgs] = useArgs()
    const handleOnOpenChange = (open: boolean) => {
      setArgs({ ...args, open: open })
    }

    return (
      <ToastProvider swipeDirection={'right'} swipeThreshold={100}>
        <Toast {...args} className={s.swipeRightClose} onOpenChange={handleOnOpenChange}>
          <ToastTitle>{args?.title}</ToastTitle>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    )
  },
}

export const Error: Story = {
  ...TemplateSimple,
  args: {
    title: 'Dangerous danger',
    open: true,
    variant: 'danger',
    duration: 1000000,
    position: 'topCenter',
    from: 'auto',
  },
}

export const SevereError: Story = {
  ...TemplateSimple,
  args: {
    title: 'Very dangerous danger',
    open: true,
    variant: 'dangerColored',
    duration: 1000000,
    position: 'topCenter',
    from: 'auto',
  },
}

export const Success: Story = {
  ...TemplateSimple,
  args: {
    title: 'Successful success',
    open: true,
    variant: 'success',
    duration: 1000000,
    position: 'topCenter',
    from: 'auto',
  },
}

export const SuperSuccess: Story = {
  ...TemplateSimple,
  args: {
    title: 'Very successful success',
    open: true,
    variant: 'successColored',
    duration: 1000000,
    position: 'topCenter',
    from: 'auto',
  },
}

export const WithAction: Story = {
  args: {
    title: 'with action',
    open: true,
    duration: 1000000,
    position: 'topCenter',
  },
  render: args => {
    const [_, setArgs] = useArgs()
    const handleOnOpenChange = (open: boolean) => {
      setArgs({ ...args, open: open })
    }

    return (
      <ToastProvider swipeDirection={'right'} swipeThreshold={100}>
        <Toast {...args} className={s.swipeRightClose} onOpenChange={handleOnOpenChange}>
          <ToastTitle>{args?.title}</ToastTitle>
          <ToastAction altText={'action'} asChild>
            <Button size={'dense'}>Action!</Button>
          </ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    )
  },
}
