import type { Meta, StoryObj } from '@storybook/react'

import { AspectRatio } from './aspect-ratio'

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
    },
    // src: {
    //   control: 'text',
    // },
  },
} satisfies Meta<typeof AspectRatio>

type Story = StoryObj<typeof meta>

export default meta

export const Overview: Story = {
  args: {
    ratio: 4 / 3,
    src: 'https://www.shutterstock.com/shutterstock/photos/385149142/display_1500/stock-photo-the-word-react-is-lined-with-gold-letters-on-wooden-planks-d-illustration-jpeg-385149142.jpg',
  },
}
