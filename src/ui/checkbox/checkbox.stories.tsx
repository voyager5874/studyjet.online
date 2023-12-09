import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from './checkbox'

const meta = {
  component: Checkbox,
  title: 'Components/Checkbox',
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {}

const Template: Story = {
  render: args => <Checkbox id={'terms1'} {...args} />,
}

export const WithText: Story = {
  ...Template,
  args: {
    label: 'Accept terms and conditions',
  },
}
