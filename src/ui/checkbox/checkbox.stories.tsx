import type { Meta, StoryObj } from '@storybook/react'

import { Card } from '@/ui/card'

import { Checkbox } from './checkbox'

/**
 * ## Checkbox based on radix-ui checkbox
 *  This component is based on radix-ui checkbox and render a button underneath,
 *  it does render an input when used within a form, but
 *  a ref given to the component 'root' goes to the button anyway,
 *  so react-hook-form can't track the value without the component to be 'controlled'
 */

const meta = {
  component: Checkbox,
  tags: ['autodocs'],
  title: 'Components/CheckboxRadix',
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
