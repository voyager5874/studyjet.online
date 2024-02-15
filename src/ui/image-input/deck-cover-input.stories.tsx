import type { Meta, StoryObj } from '@storybook/react'

import { Card } from '@/ui/card'
import { useArgs } from '@storybook/preview-api'

import { DeckCoverInput } from './deck-cover-input'

const meta = {
  title: 'App/DeckCoverImageInput',
  component: DeckCoverInput,
  argTypes: {
    value: {
      control: 'array',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeckCoverInput>

export default meta

type Story = StoryObj<typeof meta>

const Template: Story = {
  args: {
    value: '',
    defaultValue: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
  render: args => {
    const { onValueChange, ...restArgs } = args
    const [_, setArgs] = useArgs()

    const handleValueChange = (value: string) => {
      setArgs({ value })
    }

    return (
      <>
        <Card style={{ width: '500px' }}>
          <DeckCoverInput {...restArgs} onValueChange={handleValueChange} />
        </Card>
      </>
    )
  },
}

export const Overview: Story = {
  ...Template,
  args: {
    value: '',
    defaultValue:
      'https://andrii-flashcards.s3.eu-central-1.amazonaws.com/007edc15-9c30-48ed-bd31-26a473321390-image.jpeg',
  },
}

export const ScaleDown: Story = {
  ...Template,
  args: {
    value: '',
    defaultValue: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
}

export const NoDefault: Story = {
  args: {
    value: '',
  },
}

export const Uncontrolled: Story = {
  args: {},
}
