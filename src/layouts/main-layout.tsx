import { Link, Outlet } from 'react-router-dom'

import { AppRoutes } from '@/app/app-routes'
import { useLogoutMutation, useMeQuery } from '@/features/user/api'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Button } from '@/ui/button'

import s from './main-layout.module.scss'

export const MainLayout = () => {
  const { data } = useMeQuery()
  const appUnlocked = Boolean(!data?.isError)
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
  const [value, setValue] = useLocalStorage('theme', 'dark')

  const nextTheme = value === 'light' ? 'dark' : 'light'

  if (document.body.dataset.theme !== value) {
    document.body.dataset.theme = value
  }

  return <Button onClick={() => setValue(nextTheme)}>Change to {nextTheme} mode</Button>
}
