import type { DeckItem } from '@/features/decks/types'
import type { Column, Sort, TableProps } from '@/ui/table'
import type { Meta, StoryObj } from '@storybook/react'

import { Typography } from '@/ui/typography'
import { isReactNode } from '@/utils'
import { getFormattedDate } from '@/utils/dates'
import { useArgs } from '@storybook/preview-api'

import { DecksTable } from './decks-table'

const meta = {
  argTypes: {
    sort: {
      control: {
        type: 'object',
      },
    },
  },
  component: DecksTable,
  tags: ['autodocs'],
  title: 'App/DecksTable',
} satisfies Meta<typeof DecksTable>

export default meta

type Story = StoryObj<typeof meta>

const data: DeckItem[] = [
  {
    author: {
      id: '0afa4517-54e8-4b13-a9a6-01fde9e42f76',
      name: 'Android 🤖',
    },
    cardsCount: 0,
    cover: null,
    created: '2023-10-18T19:12:27.906Z',
    id: 'clnw4r9j5123mvo2qurvlo8d4',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: '🙃🙃🙃',
    rating: 0,
    shots: 0,
    updated: '2023-10-18T19:12:27.906Z',
    userId: '0afa4517-54e8-4b13-a9a6-01fde9e42f76',
  },
  {
    author: {
      id: '2311111f-61b6-4168-91b1-1b2307bcf458',
      name: 'Dragon',
    },
    cardsCount: 1,
    cover: null,
    created: '2023-11-07T16:27:31.497Z',
    id: 'cloojo6qw1evxvo2q7v37mz4q',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: '🔥🌛🍂',
    rating: 0,
    shots: 0,
    updated: '2023-11-14T20:24:31.094Z',
    userId: '2311111f-61b6-4168-91b1-1b2307bcf458',
  },
  {
    author: {
      id: '58d6551d-1911-4a7c-857f-806c83118b2a',
      name: 'messi-messi-messi',
    },
    cardsCount: 6,
    cover:
      'https://andrii-flashcards.s3.eu-central-1.amazonaws.com/4f7969e6-9140-4d12-9972-bc2132f6c0a2-Asset%2010%404x.png',
    created: '2023-09-27T12:02:25.367Z',
    id: 'cln1p5c5z0p01vo2qesa5x8qx',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'Яблоко',
    rating: 0,
    shots: 0,
    updated: '2023-10-01T22:34:49.310Z',
    userId: '58d6551d-1911-4a7c-857f-806c83118b2a',
  },
  {
    author: {
      id: '4b29a9f4-745a-44eb-8a94-1c85c5650dbe',
      name: 'Иннокентий',
    },
    cardsCount: 0,
    cover: null,
    created: '2023-09-25T16:12:48.912Z',
    id: 'clmz37n2n0o7jvo2qnr8mk50o',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'ыыыыы',
    rating: 0,
    shots: 0,
    updated: '2023-09-25T16:12:48.912Z',
    userId: '4b29a9f4-745a-44eb-8a94-1c85c5650dbe',
  },
  {
    author: {
      id: '4b29a9f4-745a-44eb-8a94-1c85c5650dbe',
      name: 'Иннокентий',
    },
    cardsCount: 5,
    cover: null,
    created: '2023-09-25T16:04:05.767Z',
    id: 'clmz2wfeu0o77vo2qdmw2rebt',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'ыыыы',
    rating: 0,
    shots: 0,
    updated: '2023-10-11T12:57:21.840Z',
    userId: '4b29a9f4-745a-44eb-8a94-1c85c5650dbe',
  },
  {
    author: {
      id: '4cd53254-99af-4404-a039-d69244bfe9be',
      name: 'MegaUltraMan',
    },
    cardsCount: 0,
    cover: null,
    created: '2023-10-15T15:59:04.491Z',
    id: 'clnrnj0a20ztjvo2qkiwnyxte',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'ываываы',
    rating: 0,
    shots: 0,
    updated: '2023-10-15T15:59:04.491Z',
    userId: '4cd53254-99af-4404-a039-d69244bfe9be',
  },
  {
    author: {
      id: 'ed6b4e7a-967d-497b-ba34-4c45b9f6ff52',
      name: 'Julia Margunova',
    },
    cardsCount: 0,
    cover: null,
    created: '2023-09-19T13:07:29.071Z',
    id: 'clmqby6y70lipvo2qpedogvun',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'чЧяЯ',
    rating: 0,
    shots: 0,
    updated: '2023-09-19T13:15:09.039Z',
    userId: 'ed6b4e7a-967d-497b-ba34-4c45b9f6ff52',
  },
  {
    author: {
      id: 'f2be95b9-4d07-4751-a775-bd612fc9553a',
      name: 'testName',
    },
    cardsCount: 0,
    cover: null,
    created: '2023-08-29T17:35:30.702Z',
    id: 'cllwl9zm50bbkvo2qwaktgp0w',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'цццццц',
    rating: 0,
    shots: 0,
    updated: '2023-08-29T17:35:30.702Z',
    userId: 'f2be95b9-4d07-4751-a775-bd612fc9553a',
  },
  {
    author: {
      id: '0afa4517-54e8-4b13-a9a6-01fde9e42f76',
      name: 'Android 🤖',
    },
    cardsCount: 8,
    cover: null,
    created: '2023-10-16T11:01:20.847Z',
    id: 'clnssbz9q105mvo2qp46thdt2',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'цукцу',
    rating: 0,
    shots: 0,
    updated: '2023-10-18T18:57:24.046Z',
    userId: '0afa4517-54e8-4b13-a9a6-01fde9e42f76',
  },
  {
    author: {
      id: 'fcaa9d5c-521f-4c35-bf5a-c9d8cec95797',
      name: '48',
    },
    cardsCount: 0,
    cover: null,
    created: '2023-10-25T07:28:50.702Z',
    id: 'clo5fpd72165xvo2quwp4uyuo',
    isBlocked: null,
    isDeleted: null,
    isPrivate: false,
    name: 'цкуцукцук',
    rating: 0,
    shots: 0,
    updated: '2023-10-25T07:28:50.702Z',
    userId: 'fcaa9d5c-521f-4c35-bf5a-c9d8cec95797',
  },
]

const columns: Column<DeckItem>[] = [
  {
    adapter: name => (
      <Typography href={'/decks/id/cards'} variant={'link1'}>
        {name}
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
    adapter: date => getFormattedDate(date),
    key: 'updated',
    title: 'Last Updated',
  },
  {
    adapter: author => (isReactNode(author?.name) ? author.name : ''),
    key: 'author',
    onClick: (id: string, key: number | string | symbol) => {
      console.log('column click', id, key)
    },
    sortable: true,
    title: 'Created by',
  },
]

export const Overview: Story = {
  args: {
    columns,
    data,
    onEdit: (id: string) => {
      console.log('onEdit prop', id)
    },
    sort: { direction: 'asc', key: 'name' },
  },
  render: args => {
    const { columns, data, onChangeSort, ...restProps } = args

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs<TableProps<DeckItem>>()
    const changeSort = (sort: Sort<DeckItem>) => {
      setArgs({ ...args, sort })
    }

    return <DecksTable columns={columns} data={data} {...restProps} onChangeSort={changeSort} />
  },
}
