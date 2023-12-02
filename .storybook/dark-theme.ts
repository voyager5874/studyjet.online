import { create } from '@storybook/theming/create'

export const darkTheme = create({
  base: 'dark',
  //appBg: '#000', //sidebar
  appContentBg: '#000',
  fontBase: '"Roboto", sans-serif',
  colorPrimary: '#8c61ff',
  colorSecondary: '#8c61ff',
  // colorSecondary: '#4c4c4c',
  inputBorderRadius: 2,
  appBorderRadius: 2,
})
