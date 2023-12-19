import type { SignInData } from '@/features/user'

import { changeAppUnlockStatus } from '@/app/app-state-slice'
import { useAppDispatch } from '@/app/store'
import { SignInForm } from '@/features/user'
import { useLoginMutation } from '@/features/user/api'

export const Page = () => {
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()

  const handleLogin = (values: SignInData) => {
    login(values)
      .unwrap()
      .then(_ => dispatch(changeAppUnlockStatus(true)))
  }

  return (
    <section>
      <SignInForm onSubmit={handleLogin} />
    </section>
  )
}
