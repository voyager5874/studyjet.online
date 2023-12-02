import type { ComponentPropsWithoutRef } from 'react'

import s from './button.module.scss'

type Props = ComponentPropsWithoutRef<'button'>
export const Button = (props: Props) => {
  return <button {...props} className={s.button} />
}
