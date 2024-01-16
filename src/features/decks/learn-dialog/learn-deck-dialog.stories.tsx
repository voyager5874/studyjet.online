import type { Meta, StoryObj } from '@storybook/react'

import { cardsList, decksList } from '@/mocks-n-stubs'
import { Button } from '@/ui/button'
import { useArgs } from '@storybook/preview-api'
import { LucidePlayCircle } from 'lucide-react'

import { LearnDeckDialog } from './learn-dialog'

const meta = {
  title: 'App/DeckLearnDialog',
  component: LearnDeckDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof LearnDeckDialog>

type Story = StoryObj<typeof meta>
export default meta

export const Overview: Story = {
  args: {
    title: `Learn "${decksList[2].name}"`,
    card: cardsList[1],
    trigger: (
      <Button variant={'icon'}>
        <LucidePlayCircle size={16} />
      </Button>
    ),
  },
  render: args => {
    const { onSubmit, ...restArgs } = args
    const [_, _setArgs] = useArgs()
    const handleSubmit = (data: any) => {
      alert(JSON.stringify(data))
    }

    return <LearnDeckDialog {...restArgs} onSubmit={handleSubmit} />
  },
}
