import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './radio-group'

const meta = {
  title: 'App/RadioGroup',
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          outline: '1px solid grey',
          padding: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
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
  { value: 'hello', title: 'item1', itemId: 'hello' },
  { value: 'GGGGG', title: 'item2', itemId: 'GGGGG' },
  { value: 'aaa', title: 'item3', itemId: 'aaa' },
  { value: 'TTT', title: 'item4', itemId: 'TTT' },
  { value: 'atttaa', title: 'item5', itemId: 'atttaa' },
  { value: 'affffaa', title: 'item6', itemId: 'affffaa' },
]

export const Overview: Story = {
  args: {
    items,
  },
}
