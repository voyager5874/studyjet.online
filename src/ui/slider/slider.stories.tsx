import type { RangeSliderProps } from './slider'
import type { Meta, StoryObj } from '@storybook/react'

import { useArgs } from '@storybook/preview-api'

import { Slider } from './slider'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: 'number',
    },
    min: { control: 'number' },
    step: { control: 'number', defaultValue: 1 },
    disabled: { control: 'boolean' },
    minStepsBetweenThumbs: { control: 'number' },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: 'radio',
    },
    name: { control: { type: 'text' } },
  },
} satisfies Meta<typeof Slider>

type Story = StoryObj<typeof meta>

export default meta

const StoryTemplate: Story = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs<RangeSliderProps>()

    const updateArgs = (e: number[]) => {
      setArgs({ ...args, value: e })
    }

    const updateRefs = (e: number[]) => {
      console.log('commit', e)
    }

    return <Slider onValueChange={updateArgs} onValueCommit={updateRefs} {...args} />
  },
}

export const Overview: Story = {
  ...StoryTemplate,
  args: {
    showValues: true,
    max: 100,
    min: 0,
    value: [10, 70],
  },
}

export const Vertical: Story = {
  ...StoryTemplate,
  decorators: [
    Story => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: { controls: { exclude: ['orientation'] } },
  args: {
    ...Overview.args,
    orientation: 'vertical',
    showValues: false,
  },
}

export const Triple: Story = {
  ...StoryTemplate,
  args: {
    showValues: false,
    max: 100,
    min: 0,
    value: [10, 40, 70],
  },
}
