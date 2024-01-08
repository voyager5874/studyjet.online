import type { Meta, StoryObj } from '@storybook/react'

import * as Tabs from './tabs'

const meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  component: Tabs.Tabs,
  argTypes: {
    disabled: { control: { type: 'boolean' } },
    activationMode: {
      options: ['automatic', 'manual'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Tabs.Tabs>

export default meta

type Story = StoryObj<typeof meta>

const tabsItems = ['One', 'Two', 'Three', 'Four', 'Five']

const Template: Story = {
  render: args => (
    <Tabs.Tabs {...args}>
      <Tabs.TabsList>
        {tabsItems.map((item, index) => (
          <Tabs.TabsTrigger value={item} key={index} disabled={item === 'One'}>
            {item}
          </Tabs.TabsTrigger>
        ))}
      </Tabs.TabsList>
      {tabsItems.map((item, index) => (
        <Tabs.TabsContent value={item} key={index}>
          {item}
        </Tabs.TabsContent>
      ))}
    </Tabs.Tabs>
  ),
}

export const Overview: Story = {
  ...Template,
  args: {},
}
