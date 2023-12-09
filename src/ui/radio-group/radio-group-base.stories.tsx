import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroupItem, RadioGroupRoot } from '@/ui/radio-group'

const meta = {
  title: 'Components/RadioGroup',
  tags: ['autodocs'],
  component: RadioGroupRoot,
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
  { value: 'hello', key: 'item1' },
  { value: 'GGGGG', key: 'item2' },
  { value: 'aaa', key: 'item3' },
  { value: 'TTT', key: 'item4' },
  { value: 'atttaa', key: 'item5' },
  { value: 'affffaa', key: 'item6' },
]

const Template: Story = {
  render: args => {
    const { disabled, ...rest } = args

    return (
      <RadioGroupRoot {...rest} disabled={disabled}>
        {items.map(item => (
          <RadioGroupItem disabled={disabled} id={item.key} key={item.key} value={item.value} />
        ))}
      </RadioGroupRoot>
    )
  },
}

export const Overview: Story = {
  ...Template,
}
