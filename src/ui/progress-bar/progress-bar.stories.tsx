import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { ProgressBar } from './progress-bar'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>

export default meta

type Story = StoryObj<typeof meta>

export const Indeterminate: Story = {
  args: { show: true },
  render: args => {
    return <ProgressBar {...args} />
  },
}

export const Controlled: Story = {
  args: { value: 10, show: true },
  render: args => {
    const { value, ...restArgs } = args

    const [progress, setProgress] = useState(value || 0)

    const changeState = () => {
      setProgress(prev => {
        if (prev <= 98) {
          return prev + 1
        } else {
          return 1
        }
      })
    }

    useEffect(() => {
      const timer = setInterval(changeState, 100)

      return () => clearInterval(timer)
    }, [])

    return <ProgressBar {...restArgs} value={progress} />
  },
}
