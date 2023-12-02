import { useGetDecksQuery } from '@/services/api'

export const Page = () => {
  const { data, error, isFetching, isLoading } = useGetDecksQuery()

  console.log(data)
  console.log(error)

  return (
    <>
      <div>Deck page</div>
      <div>
        {data?.items?.length && data.items.map(item => <div key={item.id}>{item?.name}</div>)}
        {(isFetching || isLoading) && 'loading...'}
      </div>
    </>
  )
}
