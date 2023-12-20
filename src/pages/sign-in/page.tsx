import type { SignInData } from '@/features/user'

import { SignInForm } from '@/features/user'
import { useLoginMutation } from '@/features/user/api'

export const Page = () => {
  const [login] = useLoginMutation()

  const handleLogin = (values: SignInData) => {
    login(values)
  }

  return (
    <section>
      <SignInForm onSubmit={handleLogin} />
    </section>
  )
}
