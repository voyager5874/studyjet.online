import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { AppRoutes } from '@/app/app-routes'
import { changeAppUnlockStatus } from '@/app/app-state-slice'
import { useAppUnlockStatus } from '@/app/mocks-n-stubs'
import { useAppDispatch } from '@/app/store'
import { useLogoutMutation } from '@/features/user/api'
import { Button } from '@/ui/button'

import s from './main-layout.module.scss'

export const MainLayout = () => {
  const appUnlocked = useAppUnlockStatus()
  const dispatch = useAppDispatch()
  const [logout] = useLogoutMutation()
  const handleLogout = () => {
    logout()
      .unwrap()
      .then(_ => dispatch(changeAppUnlockStatus(false)))
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
