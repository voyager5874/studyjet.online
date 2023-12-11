import type { Meta, StoryObj } from '@storybook/react'

import { Select, SelectItem } from './select'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
  decorators: [
    Story => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '300px',
          height: '100px',
          outline: '1px solid grey',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

type Story = StoryObj<typeof meta>

export default meta

const selectItems = [
  { name: 'item 1', value: 'item1' },
  { name: 'item 2', value: 'item2' },
  { name: 'item 3', value: 'item3' },
]

export const Overview: Story = {
  render: args => {
    return (
      <Select defaultValue={'item1'} {...args}>
        {selectItems.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
    )
  },
}

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const Pagination: Story = {
  render: args => {
    return (
      <Select defaultValue={'2'} {...args} dense>
        {pages.map(page => (
          <SelectItem dense key={page} value={String(page)}>
            {page}
          </SelectItem>
        ))}
      </Select>
    )
  },
  args: {},
}

export const WithDisabledItems: Story = {
  render: args => {
    return (
      <Select {...args} placeholder={'Select an item'}>
        <SelectItem disabled value={'item1'}>
          item 1
        </SelectItem>
        <SelectItem value={'item2'}>item 2</SelectItem>
        <SelectItem value={'item3'}>item 3</SelectItem>
        <SelectItem disabled value={'item4'}>
          item 4
        </SelectItem>
      </Select>
    )
  },
}
