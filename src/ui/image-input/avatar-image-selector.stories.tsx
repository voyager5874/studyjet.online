import type { Meta, StoryObj } from '@storybook/react'

import { AvatarImageSelector } from './avatar-image-selector'

const meta = {
  title: 'App/AvatarImageSelector',
  component: AvatarImageSelector,
  argTypes: {},
  tags: ['autodocs'],
} satisfies Meta<typeof AvatarImageSelector>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {},
}

export const WithInitialContent: Story = {
  args: {
    initialContent:
      'https://static.tvtropes.org/pmwiki/pub/images/abcb6534_7913_4eb1_a7a5_62b081ebc628.png',
  },
}
