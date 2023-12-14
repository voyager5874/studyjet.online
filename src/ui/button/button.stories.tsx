import type { Meta, StoryObj } from '@storybook/react'

import { LogOut, Trash } from 'lucide-react'

import { Button, buttonSizes, buttonVariants } from './button'

const meta = {
  argTypes: {
    variant: {
      control: 'radio',
      options: buttonVariants,
    },
    size: {
      control: 'radio',
      options: buttonSizes,
    },
  },
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
  component: Button,
  tags: ['autodocs'],
  title: 'Components/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const Template: Story = {
  render: ({ size, variant, ...args }) => {
    return <Button size={size} variant={variant} {...args} />
  },
}

export const Overview: Story = {
  ...Template,
  args: {
    children: 'Button',
    disabled: false,
    variant: 'primary',
  },
  parameters: { controls: { exclude: ['asChild'] } },
}

export const PrimaryButton: Story = {
  args: {
    children: 'Primary Button',
    disabled: false,
    variant: 'primary',
  },
  parameters: { controls: { exclude: ['variant', 'children', 'asChild'] } },
}

export const IconButton: Story = {
  ...Template,
  args: {
    children: <Trash />,
    disabled: false,
    variant: 'icon',
  },
  parameters: { controls: { exclude: ['variant', 'children', 'asChild'] } },
}

export const GhostButton: Story = {
  ...Template,
  args: {
    children: (
      <>
        <Trash />
        <span style={{ width: '8px' }}></span>
        Text
      </>
    ),
    disabled: false,
    variant: 'ghost',
  },
  parameters: { controls: { exclude: ['variant', 'children', 'asChild'] } },
}

export const RegularWithIcon: Story = {
  ...Template,
  args: {
    children: (
      <>
        <LogOut size={14} />
        <span style={{ width: '8px' }}></span>
        Text
      </>
    ),
    disabled: false,
    variant: 'primary',
  },
  parameters: { controls: { exclude: ['variant', 'children', 'asChild'] } },
}
