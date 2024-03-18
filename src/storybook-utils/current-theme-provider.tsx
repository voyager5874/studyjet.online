import type { ComponentPropsWithoutRef } from 'react'
import { useEffect } from 'react'

import s from './custom-css-provider.module.scss'

// export const StorybookThemeContext = createContext<'dark' | 'light'>('dark')
type Props = {
  backgrounds?: { name: string; value: string }[]
  currentBackground?: string
} & ComponentPropsWithoutRef<'div'>
export const CurrentThemeProvider = ({ currentBackground, backgrounds, ...rest }: Props) => {
  const darkBackground = backgrounds ? backgrounds.find(option => option.name === 'dark') : null

  useEffect(() => {
    if (currentBackground && darkBackground) {
      const theme = currentBackground === darkBackground.value ? 'dark' : 'light'

      document.body.setAttribute('data-theme', theme)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBackground])

  return (
    // <StorybookThemeContext.Provider value={storybookTheme}>
    <div {...rest} className={s.root} />
    // </StorybookThemeContext.Provider>
  )
}
