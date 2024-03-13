import type { Meta, StoryObj } from '@storybook/react'

import { useArgs } from '@storybook/preview-api'

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

export const Controlled: Story = {
  args: { label: 'test test', checked: true },
  render: function Render(args) {
    const { checked, onChange, ...rest } = args
    const [_args, updateArg] = useArgs()
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateArg({ checked: e.target.checked })
    }

    return <CustomCheckbox {...rest} checked={checked} onChange={handleValueChange} />
  },
}

export const DefaultChecked: Story = {
  args: { label: 'test test', defaultChecked: true },
  render: function Render(args) {
    const { defaultChecked, checked, onChange, ...rest } = args

    return <CustomCheckbox {...rest} defaultChecked={defaultChecked} />
  },
}
