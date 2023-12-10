import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './radio-group'

const meta = {
  title: 'App/RadioGroup',
  tags: ['autodocs'],
  component: RadioGroup,
  parameters: { controls: { exclude: ['asChild', 'ref'] } },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: 'radio',
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

const items = [
  { value: 'hello', key: 'item1' },
  { value: 'GGGGG', key: 'item2' },
  { value: 'aaa', key: 'item3' },
  { value: 'TTT', key: 'item4' },
  { value: 'atttaa', key: 'item5' },
  { value: 'affffaa', key: 'item6' },
]

export const Overview: Story = {
  args: {
    items,
  },
}
