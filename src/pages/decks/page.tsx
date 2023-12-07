import type { DeckItem } from '@/features/decks/types'
import type { Column } from '@/ui/table'

import { decksTableColumns } from '@/features/decks/table-columns'
import { DeckActions } from '@/features/decks/table-deck-actions'
import { useGetDecksQuery } from '@/services/api'
import { Table } from '@/ui/table'

export const Page = () => {
  const { data, error, isFetching, isLoading } = useGetDecksQuery()
  const columns: Column<DeckItem>[] = [
    ...decksTableColumns,

    {
      render: deck => <DeckActions deck={deck} />,
      title: '',
    },
  ]

  console.log(data)
  console.log(error)

  return (
    <>
      <Table caption={'Decks'} columns={columns} data={data?.items || []} />
      <div>{(isFetching || isLoading) && 'loading...'}</div>
    </>
  )
}
