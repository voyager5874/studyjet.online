import type { SignInData } from '@/features/user'

import { SignInForm } from '@/features/user'
import { useLoginMutation } from '@/features/user/api'
import { useToast } from '@/ui/toast'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const [login] = useLoginMutation()

  const { toast } = useToast()

  const handleLogin = (values: SignInData) => {
    login(values)
      .unwrap()
      .catch(err => {
        toast({
          title: err,
          variant: 'dangerColored',
          from: 'top',
          position: 'topCenter',
          type: 'foreground',
        })
      })
  }

  return (
    <section className={clsx(s.page)}>
      <SignInForm onSubmit={handleLogin} />
    </section>
  )
}
