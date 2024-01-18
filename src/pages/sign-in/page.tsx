import type { SignInData } from '@/features/user'

import { SignInForm } from '@/features/user'
import { useLoginMutation } from '@/features/user/api'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const [login] = useLoginMutation()

  const handleLogin = (values: SignInData) => {
    login(values)
  }

  return (
    <section className={clsx(s.page)}>
      <SignInForm onSubmit={handleLogin} />
    </section>
  )
}
