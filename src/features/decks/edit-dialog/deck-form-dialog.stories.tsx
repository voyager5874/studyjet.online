import type { Meta, StoryObj } from '@storybook/react'

import { EditDeckDialog } from '@/features/decks/edit-dialog/edit-dialog'
import { decksList } from '@/mocks-n-stubs'
import { Button } from '@/ui/button'
import { useArgs } from '@storybook/preview-api'
import { LucidePencil } from 'lucide-react'

const meta = {
  title: 'App/DeckFormDialog',
  component: EditDeckDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof EditDeckDialog>

type Story = StoryObj<typeof meta>
export default meta

export const CreateDialog: Story = {
  args: {
    trigger: <Button>Add new deck</Button>,
    title: 'Add new deck?',
    onSubmit: async (data: any) => {
      console.log(data)
    },
  },
}

export const EditDialog: Story = {
  args: {
    onSubmit: async () => {},
    title: 'edit deck',
    deck: decksList[2],
    trigger: (
      <Button variant={'tertiary'}>
        <LucidePencil size={16} /> <span>Edit deck</span>
      </Button>
    ),
  },
  render: args => {
    const { onSubmit, ...restArgs } = args
    const [_, _setArgs] = useArgs()
    const handleSubmit = async (data: any) => {
      alert(JSON.stringify(data))
    }

    return <EditDeckDialog {...restArgs} onSubmit={handleSubmit} />
  },
}
