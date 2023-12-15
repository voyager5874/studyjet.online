import type { Meta, StoryObj } from '@storybook/react'

import { Card } from '@/ui/card'

import { Checkbox } from './checkbox'

const meta = {
  component: Checkbox,
  title: 'Components/Checkbox',
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {}

const Template: Story = {
  render: args => <Checkbox {...args} />,
}

export const WithText: Story = {
  ...Template,
  decorators: [
    Story => (
      <Card>
        <Story />
      </Card>
    ),
  ],
  args: {
    label: 'Accept terms and conditions',
  },
}
