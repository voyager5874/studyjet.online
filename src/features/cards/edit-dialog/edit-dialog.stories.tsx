import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/ui/button'

import { EditCardDialog } from './edit-dialog'

const meta = {
  title: 'App/CardFormDialog',
  component: EditCardDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof EditCardDialog>

type Story = StoryObj<typeof meta>
export default meta

export const CreateDialog: Story = {
  args: {
    trigger: <Button>Add new card</Button>,
    title: 'Add new card?',
    onSubmit: (data: any) => {
      alert(JSON.stringify(data))
    },
  },
}
