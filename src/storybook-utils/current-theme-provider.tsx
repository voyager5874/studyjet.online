import type { ComponentPropsWithoutRef } from 'react'
import { createContext } from 'react'

import s from './custom-css-provider.module.scss'

export const StorybookThemeContext = createContext<'dark' | 'light'>('dark')

export const CurrentThemeProvider = ({ ...rest }: ComponentPropsWithoutRef<'div'>) => {
  const params = new URLSearchParams(document.location.search)
  const storybookTheme = params.get('globals')?.includes('backgrounds.value:!hex(f9f7ff)')
    ? 'light'
    : 'dark'

  document.body.dataset.theme = storybookTheme

  return (
    <StorybookThemeContext.Provider value={storybookTheme}>
      <div {...rest} className={s.root} />
    </StorybookThemeContext.Provider>
  )
}
