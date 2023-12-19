import type { SignUpData } from '@/features/user/forms/sign-up-form-shema'

import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { signUpFormSchema } from '@/features/user/forms/sign-up-form-shema'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'

import s from './sign-up-form.module.scss'

type CustomProps = {
  onSubmit: (values: SignUpData) => void
}

export type RegisterFormProps = CustomProps &
  Omit<ComponentPropsWithoutRef<'form'>, keyof CustomProps>

function SignUpForm({ onSubmit, ...rest }: RegisterFormProps) {
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
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

  return (
    <Form {...form}>
      <Card className={classNames.container}>
        <Typography as={'h1'} className={classNames.title} variant={'large'}>
          Sign in
        </Typography>
        <form {...rest} className={classNames.form} onSubmit={form.handleSubmit(onSubmit)}>
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
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'password'}
            render={({ field, fieldState: { error } }) => (
              <FormItem className={classNames.formItem}>
                <FormControl>
                  <TextField
                    autoComplete={'new-password'}
                    label={'Password'}
                    placeholder={'password'}
                    {...field}
                    errorMessage={error?.message}
                    type={'password'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'repeatPassword'}
            render={({ field, fieldState: { error } }) => (
              <FormItem className={classNames.formItem}>
                <FormControl>
                  <TextField
                    autoComplete={'new-password'}
                    label={'Confirm password'}
                    placeholder={'repeat password'}
                    {...field}
                    errorMessage={error?.message}
                    type={'password'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className={classNames.button}>
            <Button size={'fill'} type={'submit'}>
              Sign up
            </Button>
          </div>
        </form>
        <section className={classNames.footer}>
          <Typography className={classNames.footerItem} variant={'body2'}>
            Already have an account?
          </Typography>
          <Typography as={Link} className={classNames.footerItem} to={'/sign-in'} variant={'link2'}>
            Sign in
          </Typography>
        </section>
      </Card>
    </Form>
  )
}

SignUpForm.displayName = 'SignUpForm'

export { SignUpForm }
