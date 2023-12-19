import type { CardItem } from '@/features/cards/types'
import type { Column, Sort, TableProps } from '@/ui/table/index'
import type { Meta, StoryObj } from '@storybook/react'

import { flexCenter } from '@/common/flex-center'
import { cardsTableColumns } from '@/features/cards'
import { CURRENT_USER } from '@/mocks-n-stubs'
import { cardsList } from '@/mocks-n-stubs/cards-list'
import { Button } from '@/ui/button'
import { useArgs } from '@storybook/preview-api'
import { PenLine, Trash } from 'lucide-react'

import { Table } from './table'

const meta = {
  argTypes: {
    sort: {
      control: 'object',
    },
  },
  component: Table<CardItem>,
  tags: ['autodocs'],
  title: 'App/CardsTable',
} satisfies Meta<typeof Table<CardItem>>

export default meta

type Story = StoryObj<typeof meta>

function renderCardActions(card: CardItem, userId: string) {
  const authorId = card?.userId

  return (
    <>
      {authorId === userId && (
        <div style={flexCenter}>
          <Button variant={'icon'}>
            <PenLine size={14} />
          </Button>
          <Button variant={'icon'}>
            <Trash size={14} />
          </Button>
        </div>
      )}
    </>
  )
}

export const Overview: Story = {
  args: {
    columns: cardsTableColumns,
    data: cardsList,

    sort: { direction: 'asc', key: 'answer' },
  },
  render: args => {
    const { columns, data, onChangeSort, ...restProps } = args

    const fullTableColumns: Column<CardItem>[] = [
      ...columns,
      { key: 'actions', title: '', render: card => renderCardActions(card, CURRENT_USER) },
    ]
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs<TableProps<CardItem>>()
    const changeSort = (sort: Sort<CardItem>) => {
      setArgs({ ...args, sort })
    }

    return <Table columns={fullTableColumns} data={data} {...restProps} onChangeSort={changeSort} />
  },
}
