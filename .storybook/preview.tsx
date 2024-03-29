import type { Preview } from '@storybook/react'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'

import { darkTheme } from './dark-theme'
import { CurrentThemeProvider } from '../src/storybook-utils'

import '../src/styles/index.scss'

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <CurrentThemeProvider
        currentBackground={context?.globals.backgrounds?.value}
        backgrounds={context.parameters?.backgrounds?.values}
      >
        {Story()}
      </CurrentThemeProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000' },
        { name: 'light', value: '#f9f7ff' },
      ],
    },
    docs: {
      theme: darkTheme,
    },
    theme: {
      selector: 'body',
      dataAttr: 'data-theme',
      nameLightTheme: 'light',
      nameDarkTheme: 'dark',
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
