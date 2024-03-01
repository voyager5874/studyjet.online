import type { ChangePasswordData } from '@/features/user/forms/change-password-form-shema'

import { useNavigate, useParams } from 'react-router-dom'

import { paths } from '@/app/app-routes'
import { useUpdatePasswordMutation } from '@/features/user/api'
import { ChangePasswordForm } from '@/features/user/forms/change-password-form'
import { useToast } from '@/ui/toast'
import { clsx } from 'clsx'

import s from './page.module.scss'

export const Page = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [updatePassword] = useUpdatePasswordMutation()

  const { toast } = useToast()

  const handleNewPasswordSubmit = (data: ChangePasswordData) => {
    const { password } = data

    token &&
      password &&
      updatePassword({ password, token })
        .unwrap()
        .then(_ => {
          navigate(paths.signIn)
        })
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
        <ChangePasswordForm onSubmit={handleNewPasswordSubmit} />
      </div>
    </>
  )
}
