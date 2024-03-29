import type { SignInData } from '@/features/user/forms/sign-in-form-shema'

import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { paths } from '@/app/app-routes'
import { signInFormSchema } from '@/features/user/forms/sign-in-form-shema'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Checkbox } from '@/ui/checkbox'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'

import s from './sign-in-form.module.scss'

type CustomProps = {
  defaultEmail?: string
  defaultPassword?: string
  defaultRememberMe?: boolean
  onSubmit: (values: SignInData) => void
}

export type LoginFormProps = CustomProps & Omit<ComponentPropsWithoutRef<'form'>, keyof CustomProps>

export function SignInForm({
  onSubmit,
  defaultPassword,
  defaultEmail,
  defaultRememberMe,
  ...rest
}: LoginFormProps) {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: defaultEmail || '',
      password: defaultPassword || '',
      rememberMe: defaultRememberMe || false,
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
          Sign in
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
                    placeholder={'email'}
                    {...field}
                    errorMessage={fieldState.error?.message}
                    id={`${formId}-email`}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'password'}
            render={({ field }) => (
              <FormItem className={classNames.formItem}>
                <FormControl>
                  <TextField
                    autoComplete={'current-password'}
                    label={'Password'}
                    placeholder={'password'}
                    {...field}
                    id={`${formId}-password`}
                    type={'password'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'rememberMe'}
            render={({ field }) => (
              <FormItem className={classNames.formItem}>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    id={`${formId}-rememberMe`}
                    label={'remember me'}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className={classNames.formItem}>
            <Typography as={Link} to={paths.requestPasswordReset} variant={'link1'}>
              Forgot password?
            </Typography>
          </div>

          <div className={classNames.button}>
            <Button size={'fill'} type={'submit'}>
              Sign in
            </Button>
          </div>
        </form>
        <section className={classNames.footer}>
          <Typography className={classNames.footerItem} variant={'body2'}>
            Don&apos;t have an account yet?
          </Typography>
          <Typography
            as={Link}
            className={classNames.footerItem}
            to={paths.signUp}
            variant={'link2'}
          >
            Sign up
          </Typography>
        </section>
      </Card>
    </Form>
  )
}
