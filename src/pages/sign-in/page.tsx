import type { FormEvent } from 'react'

import { changeAppUnlockStatus } from '@/app/app-state-slice'
import { useAppDispatch } from '@/app/store'
import { useLoginMutation } from '@/features/user/api'
import { Button } from '@/ui/button'

export const Page = () => {
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email'))
    const password = String(data.get('password'))

    if (email && password) {
      login({ email, password })
        .unwrap()
        .then(_ => dispatch(changeAppUnlockStatus(true)))
    }
  }

  return (
    <>
      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '500px',
          color: 'black',
        }}
      >
        <input name={'email'} type={'email'} />
        <input name={'password'} type={'password'} />
        <label>
          remember me
          <input type={'checkbox'} />
        </label>
        <Button>Login</Button>
      </form>
    </>
  )
}
