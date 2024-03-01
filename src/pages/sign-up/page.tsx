import type { SignUpData } from '@/features/user'

import { useNavigate } from 'react-router-dom'

import { paths } from '@/app/app-routes'
import { SignUpForm } from '@/features/user'
import { useSignUpMutation } from '@/features/user/api'
import { useToast } from '@/ui/toast'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const navigate = useNavigate()
  const [signUp] = useSignUpMutation()
  const { toast } = useToast()

  const handleRegister = (values: SignUpData) => {
    const { password, email } = values

    signUp({ password, email })
      .unwrap()
      .then(_ => navigate(paths.signIn))
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
    <>
      <div className={clsx(s.page)}>
        <SignUpForm onSubmit={handleRegister} />
      </div>
    </>
  )
}
