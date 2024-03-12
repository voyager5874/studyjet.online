import type { Meta, StoryObj } from '@storybook/react'

import { CustomCheckbox } from './custom-checkbox'

/**
 * ## Checkbox without radix
 *  uses native input type checkbox with css property 'appearance: none'
 *  works with react-hook-form 'register'
 */

const meta = {
  title: 'Components/CheckboxNative',
  component: CustomCheckbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CustomCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Template: Story = {
  args: { label: 'test test' },
  render: function Render(args) {
    return <CustomCheckbox {...args} />
  },
}
