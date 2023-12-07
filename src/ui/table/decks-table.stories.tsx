import type { DeckItem } from '@/features/decks/types'
import type { Sort, TableProps } from '@/ui/table/index'
import type { Meta, StoryObj } from '@storybook/react'

import { Provider } from 'react-redux'

import { store } from '@/app/store'
import { renderDeckActions } from '@/features/decks/render-deck-actions'
import { decksTableColumns } from '@/features/decks/table-columns'
import { decksList } from '@/mocks-n-stubs'
import { Table } from '@/ui/table/index'
import { useArgs } from '@storybook/preview-api'

const meta = {
  argTypes: {
    sort: {
      control: {
        type: 'object',
      },
    },
  },
  component: Table<DeckItem>,
  tags: ['autodocs'],
  title: 'App/DecksTable',
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof Table<DeckItem>>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    columns: [
      ...decksTableColumns,
      {
        render: deck => renderDeckActions(deck, '0afa4517-54e8-4b13-a9a6-01fde9e42f76'),
        // render: deck => <DeckActions deck={deck} />,
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
