import type { SliderProps } from './slider'
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

const onValueChangeTemplate: Story = {
  render: args => {
    const { defaultValue, value, onValueCommit, onValueChange, ...rest } = args

    const [, setArgs] = useArgs<SliderProps>()

    const updateArgs = (e: number[]) => {
      setArgs({ ...rest, value: e })
    }

    return <Slider onValueChange={updateArgs} value={value} {...rest} />
  },
}

const onValueCommitTemplate: Story = {
  render: args => {
    const { defaultValue, value, onValueCommit, onValueChange, ...rest } = args

    const [, setArgs] = useArgs<SliderProps>()

    const updateArgs = (e: number[]) => {
      setArgs({ ...rest, value: e })
    }

    return <Slider defaultValue={value} onValueCommit={updateArgs} {...rest} />
  },
}

export const Overview: Story = {
  ...onValueChangeTemplate,
  args: {
    displayValues: true,
    max: 100,
    min: 0,
    value: [10, 70],
  },
}

export const NoValues: Story = {
  args: {
    onValueCommit: value => {
      console.log(value)
    },
    // displayValues: true,
    // max: 100,
    // min: 0,
  },
}

export const CommitValue: Story = {
  ...onValueCommitTemplate,
  args: {
    displayValues: true,
    max: 100,
    min: 0,
    value: [10, 70],
  },
}

export const Vertical: Story = {
  ...onValueChangeTemplate,
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
    displayValues: false,
  },
}

export const Triple: Story = {
  ...onValueChangeTemplate,
  args: {
    displayValues: false,
    max: 100,
    min: 0,
    value: [10, 40, 70],
  },
}
