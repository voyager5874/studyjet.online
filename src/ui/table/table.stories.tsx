import type { Column } from './table'
import type { Meta, StoryObj } from '@storybook/react'

import { Table } from './table'

const meta = {
  component: Table<DataItemType>,
  tags: ['autodocs'],
  title: 'Components/Table',
} satisfies Meta<typeof Table<DataItemType>>

export default meta

type Story = StoryObj<typeof meta>

type DataItemType = {
  cardsCount: number
  createdBy: string
  id: string
  name: string
  updated: string
}

const data: DataItemType[] = [
  {
    cardsCount: 10,
    createdBy: 'John Doe',
    id: '1',
    name: 'Project A',
    updated: '2023-07-07',
  },
  {
    cardsCount: 5,
    createdBy: 'Jane Smith',
    id: '2',
    name: 'Project B',
    updated: '2023-07-06',
  },
  {
    cardsCount: 8,
    createdBy: 'Alice Johnson',
    id: '3',
    name: 'Project C',
    updated: '2023-07-05',
  },
  {
    cardsCount: 3,
    createdBy: 'Bobo Anderson',
    id: '4',
    name: 'Project D',
    updated: '2023-07-07',
  },
  {
    cardsCount: 12,
    createdBy: 'Emma Davis',
    id: '5',
    name: 'Project E',
    updated: '2023-07-04',
  },
]

const columns: Column<DataItemType>[] = [
  {
    key: 'name',
    sortable: true,
    title: 'Name',
  },
  {
    key: 'cardsCount',
    title: 'Cards',
  },
  {
    key: 'updated',
    title: 'Last Updated',
  },
  {
    key: 'createdBy',
    title: 'Created by',
  },
  // {
  //   key: 'bred',
  //   title: 'Name',
  //   sortable: true,
  // },
]

export const Overview: Story = {
  args: {
    columns,
    data,
  },
  render: args => {
    const { columns, data, ...restProps } = args

    return <Table columns={columns} data={data} {...restProps} />
  },
}
