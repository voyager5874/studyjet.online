import type { Meta, StoryObj } from '@storybook/react'

import { Typography } from '@/ui/typography'

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
          <Tabs.TabsTrigger disabled={item === 'One'} key={index} value={item}>
            {item}
          </Tabs.TabsTrigger>
        ))}
      </Tabs.TabsList>
      <Typography variant={'large'}>Tab content: </Typography>
      {tabsItems.map((item, index) => (
        <Tabs.TabsContent key={index} value={item}>
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
