import { decksTableColumns } from '@/features/decks/table-columns'
import { useGetDecksQuery } from '@/services/api'
import { Table } from '@/ui/table'

export const Page = () => {
  const { data, error, isFetching, isLoading } = useGetDecksQuery()

  console.log(data)
  console.log(error)

  return (
    <>
      <Table caption={'Decks'} columns={decksTableColumns} data={data?.items || []} />
      <div>{(isFetching || isLoading) && 'loading...'}</div>
    </>
  )
}
