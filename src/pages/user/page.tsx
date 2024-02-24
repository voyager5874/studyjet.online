import { Link, useLocation } from 'react-router-dom'

import { useMeQuery, useUpdateUserDataMutation } from '@/features/user/api'
import { UserCard } from '@/features/user/user-card/user-card'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import { LucideArrowLeft } from 'lucide-react'

import s from './page.module.scss'

export const Page = () => {
  const { state } = useLocation()
  const { data, isLoading, isFetching } = useMeQuery()
  const [updateUserData, { isLoading: isUpdating }] = useUpdateUserDataMutation()

  const busy = isFetching || isLoading || isUpdating

  const cn = {
    page: clsx(s.page),
    pageHeader: clsx(s.pageHeader),
    backLink: clsx(s.flexRow, s.backLink),
    progress: clsx(s.progress),
  }

  return (
    <>
      <ProgressBar className={cn.progress} show={busy} />
      <div className={cn.pageHeader}>
        <Link
          className={cn.backLink}
          replace
          state={{ ...state, userPageReferer: null }}
          to={state?.userPageReferer ? `../${state.userPageReferer}` : '/decks'}
        >
          <LucideArrowLeft size={16} />

          <Typography variant={'body2'}>
            {` Back to the ${
              state?.userPageReferer ? backLinkText(state.userPageReferer) : 'decks page'
            }`}
          </Typography>
        </Link>
      </div>
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

function backLinkText(ref: string) {
  const arr = ref.split('/')
  const len = arr.length

  if (len) {
    return arr[len - 1] + ' page'
  }

  return ref
}
