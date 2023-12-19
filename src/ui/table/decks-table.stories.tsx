import type { Sort, TableProps } from './table'
import type { DeckItem } from '@/features/decks'
import type { Meta, StoryObj } from '@storybook/react'

import type { CSSProperties } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from '@/app/store'
import { decksTableColumns } from '@/features/decks'
import { decksList } from '@/mocks-n-stubs'
import { Button } from '@/ui/button'
import { useArgs } from '@storybook/preview-api'
import { PenLine, PlayCircle, Trash } from 'lucide-react'

import { Table } from './table'

const meta = {
  argTypes: {
    sort: {
      control: 'object',
    },
  },
  component: Table<DeckItem>,
  tags: ['autodocs'],
  title: 'App/DecksTable',
  decorators: [
    Story => (
      <Provider store={store}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof Table<DeckItem>>

export default meta

type Story = StoryObj<typeof meta>

const flexContainer: CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'flex-end',
}

const onLearn = (id: string) => {
  alert(`onLearn called with deck id: ${id}`)
}

function renderDeckActions(deck: DeckItem, userId: string) {
  const authorId = deck?.userId

  return (
    <>
      <div style={flexContainer}>
        <Button onClick={() => onLearn(deck.id)} variant={'icon'}>
          <PlayCircle size={14} />
        </Button>
        {authorId === userId && (
          <Button variant={'icon'}>
            <PenLine size={14} />
          </Button>
        )}
        {authorId === userId && (
          <Button variant={'icon'}>
            <Trash size={14} />
          </Button>
        )}
      </div>
    </>
  )
}

export const Overview: Story = {
  args: {
    columns: [
      ...decksTableColumns,
      {
        key: 'actions',
        render: deck => renderDeckActions(deck, '0afa4517-54e8-4b13-a9a6-01fde9e42f76'),
        title: '',
      },
    ],
    data: decksList,

    sort: { direction: 'asc', key: 'name' },
  },
  render: args => {
    const { columns, data, onChangeSort, ...restProps } = args

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs<TableProps<DeckItem>>()
    const changeSort = (sort: Sort<DeckItem>) => {
      setArgs({ ...args, sort })
    }

    return <Table columns={columns} data={data} {...restProps} onChangeSort={changeSort} />
  },
}
