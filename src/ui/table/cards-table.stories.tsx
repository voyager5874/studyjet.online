import type { CardItem } from '@/features/cards/types'
import type { Column, Sort, TableProps } from '@/ui/table/index'
import type { Meta, StoryObj } from '@storybook/react'

import { cardsList } from '@/mocks-n-stubs/cards-list'
import { Grade } from '@/ui/grade'
import { Table } from '@/ui/table/index'
import { TableCell } from '@/ui/table/table-blocks'
import { Typography } from '@/ui/typography'
import { getFormattedDate } from '@/utils/dates'
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

const columns: Column<CardItem>[] = [
  {
    key: 'question',
    sortable: true,
    title: 'Question',
  },
  {
    key: 'answer',
    sortable: true,
    title: 'Answer',
  },
  {
    render: card => (
      <Typography as={TableCell} style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {getFormattedDate(card.updated)}
      </Typography>
    ),
    key: 'updated',
    title: 'Last Updated',
  },
  {
    key: 'grade',
    render: card => (
      <Typography as={TableCell} style={{ verticalAlign: 'baseline' }} variant={'body2'}>
        {<Grade grade={card.grade} />}
      </Typography>
    ),
    sortable: true,
    title: 'Acquisition',
  },
]

export const Overview: Story = {
  args: {
    columns,
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
