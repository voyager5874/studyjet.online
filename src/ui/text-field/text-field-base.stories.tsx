import type { Meta, StoryObj } from '@storybook/react'

import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { Button } from '@/ui/button'
import { useArgs } from '@storybook/preview-api'
import { Eye, EyeOff, Search, X } from 'lucide-react'

import { TextFieldBase } from './text-field-base'

const meta = {
  title: 'Components/TextField',
  component: TextFieldBase,
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['password', 'search', 'text'],
      control: 'radio',
    },
    value: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TextFieldBase>

export default meta
type Story = StoryObj<typeof meta>

const Template: Story = {
  render: args => {
    const { disabled, type, value, ...restArgs } = args
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showContent, setShowContent] = useState(false)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs()

    const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
      setArgs({ ...args, value: e.target.value })
    }

    const getFinalType = () => {
      if (type === 'password' && !showContent) {
        return 'password'
      }
      if (type === 'password' && showContent) {
        return 'text'
      }

      return type
    }

    const getSuffix = () => {
      if (type === 'password') {
        return showContent ? (
          <Button
            disabled={disabled}
            onClick={() => setShowContent(prev => !prev)}
            variant={'icon'}
          >
            <Eye size={14} />
          </Button>
        ) : (
          <Button
            disabled={disabled}
            onClick={() => setShowContent(prev => !prev)}
            variant={'icon'}
          >
            <EyeOff size={14} />
          </Button>
        )
      }
      if (type === 'search' && args.value) {
        return (
          <Button
            disabled={disabled}
            onClick={() => setArgs({ ...args, value: '' })}
            variant={'icon'}
          >
            <X size={14} />
          </Button>
        )
      }

      return null
    }

    const getPrefix = () => {
      if (type === 'search') {
        return <Search size={14} />
      }

      return null
    }

    return (
      <TextFieldBase
        {...restArgs}
        disabled={disabled}
        onChange={updateValue}
        prefixIcon={getPrefix()}
        suffixIcon={getSuffix()}
        type={getFinalType()}
        value={value}
      />
    )
  },
}

export const Overview: Story = {
  ...Template,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
}

export const Password: Story = {
  ...Template,
  parameters: { controls: { exclude: ['type'] } },
  args: {
    label: 'Password',
    placeholder: 'enter your password',
    type: 'password',
  },
}

export const Error: Story = {
  args: {
    label: 'Error Input',
    value: 'Wrong value',
    errorMessage: 'Error message',
  },
}
