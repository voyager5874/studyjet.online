import type { RequestResetPasswordFormSchemaData } from '@/features/user/forms/reset-password-form-schema'

import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { paths } from '@/app/app-routes'
import { requestResetPasswordFormSchema } from '@/features/user/forms/reset-password-form-schema'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'

import s from './password-reset-request-form.module.scss'

type CustomProps = {
  defaultEmail?: string
  onSubmit: (data: { email: string }) => void
}

export type PasswordResetRequestFormProps = CustomProps &
  Omit<ComponentPropsWithoutRef<'form'>, keyof CustomProps>

export function RequestResetPasswordForm({
  onSubmit,
  defaultEmail,
  ...rest
}: PasswordResetRequestFormProps) {
  const form = useForm<RequestResetPasswordFormSchemaData>({
    resolver: zodResolver(requestResetPasswordFormSchema),
    defaultValues: {
      email: defaultEmail || '',
    },
  })

  const classNames = {
    container: clsx(s.container),
    title: clsx(s.title),
    form: clsx(s.form),
    formItem: clsx(s.formItem),
    button: clsx(s.formItem, s.button),
    footer: clsx(s.footer),
    footerItem: clsx(s.footerItem),
  }
  const formId = useId()

  return (
    <Form {...form}>
      <Card className={classNames.container}>
        <Typography as={'h1'} className={classNames.title} variant={'large'}>
          Forgot your password?
        </Typography>
        <form className={classNames.form} onSubmit={form.handleSubmit(onSubmit)} {...rest}>
          <FormField
            control={form.control}
            name={'email'}
            render={({ field, fieldState }) => (
              <FormItem className={classNames.formItem}>
                <FormControl>
                  <TextField
                    autoComplete={'email'}
                    label={'Email'}
                    placeholder={'email you used to sign up'}
                    {...field}
                    errorMessage={fieldState.error?.message}
                    id={`${formId}-email`}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className={classNames.formItem}>
            <Typography variant={'caption'}>
              Enter your email address and we will send you further instructions
            </Typography>
          </div>

          <div className={classNames.button}>
            <Button size={'fill'} type={'submit'}>
              Send instructions
            </Button>
          </div>
        </form>
        <section className={classNames.footer}>
          <Typography className={classNames.footerItem} variant={'body2'}>
            Have you remembered your password?
          </Typography>
          <Typography
            as={Link}
            className={classNames.footerItem}
            to={paths.signIn}
            variant={'link2'}
          >
            Return to sign-in page
          </Typography>
        </section>
      </Card>
    </Form>
  )
}
