import { useMeQuery, useUpdateUserDataMutation } from '@/features/user/api'
import { UserCard } from '@/features/user/user-card/user-card'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const { data, isLoading, isFetching } = useMeQuery()
  const [updateUserData, { isLoading: isUpdating }] = useUpdateUserDataMutation()

  const busy = isFetching || isLoading || isUpdating

  const cn = {
    page: clsx(s.page),
    progress: clsx(s.progress),
  }

  return (
    <>
      <ProgressBar className={cn.progress} show={busy} />

      <div className={cn.page}>
        {data && (
          <UserCard
            avatar={data?.avatar}
            email={data.email}
            name={data.name}
            onSubmit={updateUserData}
          />
        )}
      </div>
    </>
  )
}
