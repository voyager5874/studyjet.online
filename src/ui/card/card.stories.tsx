import type { Meta, StoryObj } from '@storybook/react'

import type { CSSProperties } from 'react'

import { Button } from '@/ui/button'
import { Typography } from '@/ui/typography'

import { Card } from './card'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
    },
  },
  parameters: { controls: { exclude: ['style', 'children'] } },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: <Typography variant={'large'}>Card</Typography>,
    style: {
      width: '300px',
      height: '300px',
      padding: '24px',
    },
  },
}

const cardStyle: CSSProperties = {
  width: '300px',
  height: '300px',
  padding: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export const AsButton: Story = {
  args: {
    asChild: true,
    children: (
      <Button onClick={() => alert('hello world')} variant={'secondary'}>
        <Typography variant={'h2'}>Card as button</Typography>
      </Button>
    ),
    style: cardStyle,
  },
}

const containerStyle: CSSProperties = {
  backgroundColor: '#382766',
  padding: '50px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export const AsLink: Story = {
  decorators: Story => (
    <div style={containerStyle}>
      <Story />
    </div>
  ),
  args: {
    asChild: true,
    children: (
      <Typography href={'https://youtube.com'} variant={'link1'}>
        <Typography variant={'h2'}>Card as link</Typography>
        <Typography variant={'body2'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Typography>
      </Typography>
    ),
    style: cardStyle,
  },
}
