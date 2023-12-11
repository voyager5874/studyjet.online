import type { PaginationProps } from './pagination'
import type { Meta, StoryObj } from '@storybook/react'

import { useArgs } from '@storybook/preview-api'

import { Pagination } from './pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

const Template: Story = {
  args: {
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 10,
      totalItems: 100,
    },
    perPage: 10,
    perPageOptions: [10, 20, 50, 100],
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_, setArgs] = useArgs<PaginationProps>()
    const handlePageChange = (page: number) => {
      const newArgs = { ...args, pagination: { ...args.pagination, currentPage: page } }

      setArgs(newArgs)
    }

    const handlePerPageChange = (count: number) => {
      const total = Math.ceil(args.pagination.totalItems / count)
      const newArgs = {
        ...args,
        pagination: { ...args.pagination, totalPages: total },
        perPage: count,
      }

      setArgs(newArgs)
    }

    return (
      <Pagination
        {...args}
        onPageChange={handlePageChange}
        onPerPageCountChange={handlePerPageChange}
      />
    )
  },
}

export const Overview: Story = {
  ...Template,
}
