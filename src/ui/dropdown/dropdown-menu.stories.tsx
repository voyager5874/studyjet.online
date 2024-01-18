import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/ui/button'
import { LucideMenu } from 'lucide-react'

import { DropdownMenu, DropdownMenuItem } from './dropdown-menu'

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DropdownMenu>

type Story = StoryObj<typeof meta>

export default meta

const items = [
  { title: 'item 1', key: 'item1' },
  { title: 'item 2', key: 'item2' },
  { title: 'item 3', key: 'item3' },
  { title: 'item 4', key: 'item4' },
  { title: 'item 5', key: 'item5' },
  { title: 'item 6', key: 'item6' },
]

export const Overview: Story = {
  args: {
    align: 'start',
    trigger: (
      <Button size={'dense'} variant={'tertiary'}>
        <LucideMenu />
      </Button>
    ),
  },
  render: args => {
    return (
      <DropdownMenu {...args}>
        {items.map(item => (
          <DropdownMenuItem key={item.key}>{item.title}</DropdownMenuItem>
        ))}
      </DropdownMenu>
    )
  },
}
