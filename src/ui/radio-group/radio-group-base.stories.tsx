import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroupItem, RadioGroupRoot } from '@/ui/radio-group'

const meta = {
  title: 'Components/RadioGroup',
  tags: ['autodocs'],
  component: RadioGroupRoot,
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
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: 'radio',
    },
  },
} satisfies Meta<typeof RadioGroupRoot>

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

const Template: Story = {
  render: args => {
    const { disabled, ...rest } = args

    return (
      <RadioGroupRoot {...rest} disabled={disabled}>
        {items.map(item => (
          <RadioGroupItem
            disabled={disabled}
            id={item.itemId}
            key={item.itemId}
            title={item.title}
            value={item.value}
          />
        ))}
      </RadioGroupRoot>
    )
  },
}

export const Overview: Story = {
  ...Template,
}
