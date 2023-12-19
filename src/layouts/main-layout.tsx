import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { AppRoutes } from '@/app/app-routes'
import { useLogoutMutation, useMeQuery } from '@/features/user/api'
import { Button } from '@/ui/button'

import s from './main-layout.module.scss'

export const MainLayout = () => {
  const { data } = useMeQuery()
  const appUnlocked = Boolean(data?.id)
  const [logout] = useLogoutMutation()
  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <header className={s.header}>
        <nav>
          <div className={s.elementsList}>
            {AppRoutes.public.map(item => (
              <Link key={item.name} to={item.path}>
                {item.name}
              </Link>
            ))}
          </div>
          <div className={s.elementsList}>
            {AppRoutes.private.map(item => (
              <Link key={item.name} to={item.path}>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        <div className={s.elementsList}>
          <ThemeToggler />
          {appUnlocked && <Button onClick={handleLogout}>Logout</Button>}
        </div>
      </header>
      <main className={s.main}>
        <Outlet />
      </main>
    </>
  )
}

function ThemeToggler() {
  const [theme, setTheme] = useState('dark')
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  return <Button onClick={() => setTheme(nextTheme)}>Change to {nextTheme} mode</Button>
}
