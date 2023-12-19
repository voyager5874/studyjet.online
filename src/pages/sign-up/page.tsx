import type { SignUpData } from '@/features/user'

import { changeAppUnlockStatus } from '@/app/app-state-slice'
import { useAppDispatch } from '@/app/store'
import { SignUpForm } from '@/features/user'
import { useLoginMutation, useSignUpMutation } from '@/features/user/api'

export const Page = () => {
  const [signUp] = useSignUpMutation()
  const [login] = useLoginMutation()

  const dispatch = useAppDispatch()

  const handleRegister = (values: SignUpData) => {
    const { password, email } = values

    signUp({ password, email })
      .unwrap()
      .then(response => {
        console.log(response)
      })
      .then(_ => login({ password, email, rememberMe: true }))
      .then(_ => dispatch(changeAppUnlockStatus(true)))
      .catch(e => alert(JSON.stringify(e)))
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          minHeight: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SignUpForm onSubmit={handleRegister} />
      </div>
    </>
  )
}
