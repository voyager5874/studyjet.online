import type { Meta, StoryObj } from '@storybook/react'

import { Rating } from './rating'

const meta = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    rating: 3,
    maxRating: 3,
  },
}
