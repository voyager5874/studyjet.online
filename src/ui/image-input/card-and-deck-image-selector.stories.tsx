import type { Meta, StoryObj } from '@storybook/react'

import { Card } from '@/ui/card'
import { useArgs } from '@storybook/preview-api'

import { CardAndDeckImageSelector } from './card-and-deck-image-selector'

const meta = {
  title: 'App/DeckCoverImageInput',
  component: CardAndDeckImageSelector,
  argTypes: {},
  tags: ['autodocs'],
} satisfies Meta<typeof CardAndDeckImageSelector>

export default meta

type Story = StoryObj<typeof meta>

const Template: Story = {
  args: {
    value: '',
    sourceImage: '',
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
  render: args => {
    const { sourceImage, defaultValue, value, onSourceImageChange, onValueChange, ...restArgs } =
      args
    const [_, updateArgs] = useArgs()

    const handleValueChange = (value: string) => {
      updateArgs({ value: value })
    }

    const handleSourceImageChange = (source: string) => {
      updateArgs({ sourceImage: source })
    }

    return (
      <>
        <Card style={{ width: '500px' }}>
          <CardAndDeckImageSelector
            {...restArgs}
            onSourceImageChange={handleSourceImageChange}
            onValueChange={handleValueChange}
            sourceImage={sourceImage || ''}
            value={value || ''}
          />
        </Card>
      </>
    )
  },
}

export const Overview: Story = {
  ...Template,
  args: {
    value: '',
    sourceImage: '',
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
}

export const ScaleDown: Story = {
  ...Template,
  args: {
    value: '',
    sourceImage: '',
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
}

export const NoInitialValue: Story = {
  args: {
    value: '',
    sourceImage: '',
  },
}

export const Uncontrolled: Story = {
  args: {},
}
