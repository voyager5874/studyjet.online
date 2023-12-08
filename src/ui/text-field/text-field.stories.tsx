import type { Meta, StoryObj } from '@storybook/react'

import type { ChangeEvent } from 'react'

import { useArgs } from '@storybook/preview-api'

import { TextField } from './text-field'

const meta = {
  title: 'App/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    type: {
      control: 'radio',
      options: ['password', 'search', 'text'],
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

const Template: Story = {
  render: args => {
    const { value, ...restArgs } = args

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs()

    const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
      setArgs({ ...args, value: e.target.value })
    }

    const handleClear = () => {
      setArgs({ ...args, value: '' })
    }

    return <TextField {...restArgs} onChange={updateValue} onClear={handleClear} value={value} />
  },
}

export const Overview: Story = {
  ...Template,
  args: {
    label: 'Label',
    placeholder: 'placeholder',
    type: 'text',
  },
}
