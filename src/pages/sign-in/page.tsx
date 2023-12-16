import type { SignInData } from '@/features/user/sign-in-form-shema'

import { changeAppUnlockStatus } from '@/app/app-state-slice'
import { useAppDispatch } from '@/app/store'
import { useLoginMutation } from '@/features/user/api'
import { SignInForm } from '@/features/user/sign-in-form'

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
