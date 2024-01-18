import type { SignUpData } from '@/features/user'

import { SignUpForm } from '@/features/user'
import { useLoginMutation, useSignUpMutation } from '@/features/user/api'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const [signUp] = useSignUpMutation()
  const [login] = useLoginMutation()

  const handleRegister = (values: SignUpData) => {
    const { password, email } = values

    signUp({ password, email })
      .unwrap()
      .then(_ => login({ password, email, rememberMe: true }))
      .catch(e => alert(JSON.stringify(e)))
  }

  return (
    <>
      <div className={clsx(s.page)}>
        <SignUpForm onSubmit={handleRegister} />
      </div>
    </>
  )
}
