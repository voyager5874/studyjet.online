import { Link, Outlet } from 'react-router-dom'

import { AppRoutes } from '@/app/app-routes'
import { AppLogo } from '@/assets/app-logo'
import { useLogoutMutation, useMeQuery } from '@/features/user/api'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { UserAvatar } from '@/ui/avatar'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/ui/dropdown/dropdown-menu'
import { Typography } from '@/ui/typography'
import { clsx } from 'clsx'
import { LucideLogOut, LucideMoon, LucideRoute, LucideSun, LucideUser } from 'lucide-react'

import s from './main-layout.module.scss'

export const MainLayout = () => {
  const { data } = useMeQuery()
  // const isAuthenticated = Boolean(data && data?.id)
  const [logout] = useLogoutMutation()
  const handleLogout = () => {
    logout()
  }

  const cn = {
    link: clsx(s.link),
    headerPart: clsx(s.headerPart),
    header: clsx(s.header),
    logo: clsx(s.logo),
    email: clsx(s.subduedText),
    main: clsx(s.main),
    menuHeadingItem: clsx(s.userMenuHeadingItem),
    userMenuHeadingItemContainer: clsx(s.userMenuHeadingItemContainer),
  }

  return (
    <>
      <header className={cn.header}>
        <Link className={cn.headerPart} to={'/'}>
          <AppLogo fill={'var(--color-text-normal'} />
        </Link>

        <div className={cn.headerPart}>
          <DropdownMenu
            trigger={
              <Button variant={'ghost'}>
                <LucideRoute />
              </Button>
            }
          >
            {AppRoutes.public.map(item => (
              <DropdownMenuItem key={item.name}>
                <Link className={cn.link} to={item.path}>
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}

            {AppRoutes.private.map(item => (
              <DropdownMenuItem key={item.name}>
                <Link className={cn.link} to={item.path}>
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
          <ThemeToggle />
          {data && (
            <DropdownMenu
              align={'end'}
              trigger={<UserAvatar image={data?.avatar} username={data?.name} />}
            >
              <DropdownMenuItem className={cn.menuHeadingItem}>
                <UserAvatar image={data?.avatar} username={data?.name || 'alex void'} />
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

              <DropdownMenuItem>
                <LucideUser size={16} />
                <Typography as={Link} className={cn.link} to={'/user'} variant={'caption'}>
                  My profile
                </Typography>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LucideLogOut size={16} />
                <Typography variant={'caption'}>Sign out</Typography>
              </DropdownMenuItem>
            </DropdownMenu>
          )}
        </div>
      </header>
      <main className={cn.main}>
        <Outlet />
      </main>
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
