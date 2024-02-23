import { Link, useLocation, useParams } from 'react-router-dom'

import { Email } from '@/assets/email'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const { state } = useLocation()
  const { email } = useParams<{ email: string }>()

  const cn = {
    page: clsx(s.page),
    card: clsx(s.card, s.flexColumn),
    title: clsx(s.title),
    pictureContainer: clsx(s.pictureContainer, 'flex-row-center'),
    infoText: clsx(s.infoText, s.flexColumn),
    pageHeader: clsx(s.pageHeader),
    backLink: clsx(s.flexRow, s.backLink),
    progress: clsx(s.progress),
  }

  console.log({ state })

  return (
    <>
      <div className={cn.pageHeader}></div>
      <div className={cn.page}>
        <Card className={cn.card}>
          <Typography as={'h2'} className={cn.title} variant={'large'}>
            Check email
          </Typography>
          <div className={cn.pictureContainer}>
            <Email fill={'var(--color-bg-primary)'} />
          </div>
          <div className={cn.infoText}>
            <Typography variant={'body2'}>We've sent an email with instructions to</Typography>
            <Typography variant={'body2'}>{email}</Typography>
          </div>

          <Button asChild>
            <Link to={'/sign-in'}>Back to sign-in page</Link>
          </Button>
        </Card>
      </div>
    </>
  )
}
