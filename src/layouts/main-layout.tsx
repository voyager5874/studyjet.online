import { Link, Outlet, useLocation } from 'react-router-dom'

import { paths } from '@/app/app-routes'
import { AppLogo } from '@/assets/app-logo'
import { IconsWithWrapper } from '@/assets/icons/icons-with-wrapper'
import { useLogoutMutation, useMeQuery } from '@/features/user/api'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { UserAvatar } from '@/ui/avatar'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/ui/dropdown/dropdown-menu'
import { Spinner } from '@/ui/spinner'
import { Toaster } from '@/ui/toast'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import { LucideMoon, LucideSun } from 'lucide-react'

import s from './main-layout.module.scss'

export const MainLayout = () => {
  const { pathname, state } = useLocation()

  const { data, isLoading: userDataLoading, isError: loggedOut } = useMeQuery()

  const [logout] = useLogoutMutation()
  const handleLogout = () => {
    logout()
  }

  const [value] = useLocalStorage('theme', 'dark')

  document.body.dataset.theme = value

  const cn = {
    link: clsx(s.link),
    headerPart: clsx(s.headerPart),
    header: clsx(s.header),
    logo: clsx(s.logo),
    avatar: clsx(s.avatar),
    avatarContainer: clsx(s.avatarContainer),
    email: clsx(s.subduedText),
    main: clsx(s.main),
    menuHeadingItem: clsx(s.userMenuHeadingItem),
    userMenuHeadingItemContainer: clsx(s.userMenuHeadingItemContainer),
  }

  if (userDataLoading) {
    return <Spinner />
  }

  return (
    <>
      <header className={cn.header}>
        <Link className={cn.headerPart} to={'/'}>
          <AppLogo fill={'var(--color-text-normal'} />
        </Link>

        <div className={cn.headerPart}>
          <ThemeToggle />
          {data && (
            <DropdownMenu
              align={'end'}
              trigger={
                <div className={cn.avatarContainer}>
                  <UserAvatar className={cn.avatar} image={data?.avatar} username={data?.name} />
                </div>
              }
            >
              <DropdownMenuItem className={cn.menuHeadingItem}>
                <div className={cn.avatarContainer}>
                  <UserAvatar
                    className={cn.avatar}
                    image={data?.avatar}
                    username={data?.name || 'john doe'}
                  />
                </div>
                <div className={cn.userMenuHeadingItemContainer}>
                  <Typography as={'h3'} variant={'subtitle2'}>
                    {data?.name}
                  </Typography>
                  <Typography className={cn.email} variant={'caption'}>
                    {data?.email}
                  </Typography>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild disabled={pathname.endsWith('user')}>
                <Link
                  className={cn.link}
                  state={{ ...state, userPageReferer: `${pathname}` }}
                  to={'/user'}
                >
                  <IconsWithWrapper.user size={16} />
                  <Typography as={'h5'} variant={'caption'}>
                    My profile
                  </Typography>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild disabled={pathname.includes('favorite')}>
                <Link className={cn.link} state={state} to={paths.favoriteDecks}>
                  <IconsWithWrapper.bookMarked size={16} />
                  <Typography as={'h5'} variant={'caption'}>
                    Bookmarks
                  </Typography>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <IconsWithWrapper.logout size={16} />
                <Typography variant={'caption'}>Sign out</Typography>
              </DropdownMenuItem>
            </DropdownMenu>
          )}
        </div>
      </header>
      <main className={cn.main}>
        <Outlet context={loggedOut} />
      </main>
      <Toaster />
    </>
  )
}

function ThemeToggle() {
  const [value, setValue] = useLocalStorage('theme', 'dark')

  const nextTheme = value === 'light' ? 'dark' : 'light'

  if (document.body.dataset.theme !== value) {
    document.body.dataset.theme = value
  }

  return (
    <Button onClick={() => setValue(nextTheme)} variant={'ghost'}>
      {nextTheme === 'light' ? <LucideSun /> : <LucideMoon />}
    </Button>
  )
}
