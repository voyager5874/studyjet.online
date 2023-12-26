import type { Meta, StoryObj } from '@storybook/react'

import { CreateDeckDialog } from './create-deck-dialog'

const meta = {
  title: 'App/CreateDeckDialog',
  component: CreateDeckDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof CreateDeckDialog>

type Story = StoryObj<typeof meta>
export default meta

export const Overview: Story = {
  args: {
    title: 'Add new deck?',
    itemName: 'deck',
  },
}
