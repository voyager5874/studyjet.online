import type { ChangePasswordData } from '@/features/user/forms/change-password-form-shema'

import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'

import { changePasswordFormSchema } from '@/features/user/forms/change-password-form-shema'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'

import s from './sign-up-form.module.scss'

type CustomProps = {
  onSubmit: (values: any) => void
}

export type RegisterFormProps = CustomProps &
  Omit<ComponentPropsWithoutRef<'form'>, keyof CustomProps>

function ChangePasswordForm({ onSubmit, ...rest }: RegisterFormProps) {
  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  })

  const cn = {
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
      <Card className={cn.container}>
        <Typography as={'h1'} className={cn.title} variant={'large'}>
          Create new password
        </Typography>
        <form {...rest} className={cn.form} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name={'password'}
            render={({ field, fieldState: { error } }) => (
              <FormItem className={cn.formItem}>
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
              <FormItem className={cn.formItem}>
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
          <div className={cn.formItem}>
            <Typography variant={'caption'}>
              Create new password and we will send you further instructions to email
            </Typography>
          </div>
          <div className={cn.button}>
            <Button size={'fill'} type={'submit'}>
              Create new password
            </Button>
          </div>
        </form>
        <section className={cn.footer}>
          <Typography className={cn.footerItem} variant={'body2'}></Typography>
        </section>
      </Card>
    </Form>
  )
}

ChangePasswordForm.displayName = 'ChangePasswordForm'

export { ChangePasswordForm }
