import type { CardItem } from '@/features/cards/types'
import type { Sort, TableProps } from '@/ui/table/index'
import type { Meta, StoryObj } from '@storybook/react'

import { cardsTableColumn } from '@/features/cards/cards-table-columns'
import { cardsList } from '@/mocks-n-stubs/cards-list'
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
  component: Table<CardItem>,
  tags: ['autodocs'],
  title: 'App/CardsTable',
} satisfies Meta<typeof Table<CardItem>>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    columns: cardsTableColumn,
    data: cardsList,

    sort: { direction: 'asc', key: 'answer' },
  },
  render: args => {
    const { columns, data, onChangeSort, ...restProps } = args

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs<TableProps<CardItem>>()
    const changeSort = (sort: Sort<CardItem>) => {
      setArgs({ ...args, sort })
    }

    return <Table columns={columns} data={data} {...restProps} onChangeSort={changeSort} />
  },
}
