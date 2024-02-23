import { useNavigate } from 'react-router-dom'

import { paths } from '@/app/app-routes'
import { useRequestPasswordResetMutation } from '@/features/user/api'
import { RequestResetPasswordForm } from '@/features/user/forms/request-reset-password-form'
import { clsx } from 'clsx'

import s from './page.module.scss'
export const Page = () => {
  const [requestPasswordReset] = useRequestPasswordResetMutation()
  const navigate = useNavigate()
  const handleSubmit = (data: { email: string }) => {
    const { email } = data

    console.log('requestPasswordReset', `${paths.checkEmail}/${email}`, {
      email,
      path: paths.checkEmail,
    })
    email &&
      requestPasswordReset(email)
        .unwrap()
        .then(_ => navigate(`${paths.checkEmail}/${email}`))
        .catch(e => console.error(JSON.stringify(e)))
  }

  return (
    <>
      <div className={clsx(s.page)}>
        <RequestResetPasswordForm onSubmit={handleSubmit} />
      </div>
    </>
  )
}
