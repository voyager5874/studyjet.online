import type { Meta, StoryObj } from '@storybook/react'

import { TextArea } from './text-area'

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    autoHeight: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    errorMessage: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    rows: {
      control: 'number',
    },
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    autoHeight: true,
    placeholder: 'placeholder text',
  },
}
