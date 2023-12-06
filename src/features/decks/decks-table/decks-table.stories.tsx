import type { DeckItem } from '@/features/decks/types'
import type { Column, Sort, TableProps } from '@/ui/table'
import type { Meta, StoryObj } from '@storybook/react'

import type { CSSProperties } from 'react'

import { decksList } from '@/mocks-n-stubs'
import { Button } from '@/ui/button'
import { Table } from '@/ui/table'
import { TableCell } from '@/ui/table/table-blocks'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'
import { useArgs } from '@storybook/preview-api'
import { PenLine, PlayCircle, Trash } from 'lucide-react'

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
} satisfies Meta<typeof Table<DeckItem>>

export default meta

type Story = StoryObj<typeof meta>

const onLearn = (id: string) => {
  alert(`onLearn called with deck id: ${id}`)
}

const userId = '0afa4517-54e8-4b13-a9a6-01fde9e42f76'

const flexContainer: CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'flex-end',
}

function renderDeckActions(deck: DeckItem) {
  // const authorId = deck?.author?.id
  const authorId = deck?.userId

  return (
    <>
      <TableCell>
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
      </TableCell>
    </>
  )
}

const columns: Column<DeckItem>[] = [
  {
    render: deck => (
      <Typography href={`/decks/${deck.id}`} variant={'link1'}>
        {deck.name}
      </Typography>
    ),
    key: 'name',
    sortable: true,
    title: 'Name',
  },
  {
    key: 'cardsCount',
    sortable: true,
    title: 'Cards',
  },
  {
    render: deck => (
      <Typography as={TableCell} style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {getFormattedDate(deck.updated)}
      </Typography>
    ),
    key: 'updated',
    title: 'Last Updated',
  },
  {
    key: 'author',
    onClick: (id: string, key: number | string | symbol) => {
      console.log('column click', id, key)
    },
    render: deck => (
      <Typography as={TableCell} style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {deck.author?.name}
      </Typography>
    ),
    sortable: true,
    title: 'Created by',
  },
  {
    render: deck => renderDeckActions(deck),
    title: '',
  },
]

export const Overview: Story = {
  args: {
    columns,
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
