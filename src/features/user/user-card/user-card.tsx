import type { UserData } from '@/features/user/types'
import type { UserProfileFormData } from '@/features/user/user-card/user-data-form-schema'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useLogoutMutation } from '@/features/user/api'
import { userDataFormSchema } from '@/features/user/user-card/user-data-form-schema'
import { UserAvatar } from '@/ui/avatar'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/ui/form'
import { AvatarImageSelector } from '@/ui/image-input/avatar-image-selector'
import { TextField } from '@/ui/text-field'
import { Typography } from '@/ui/typography'
import { getChangedDataFromTwoObjects, objectToFormData } from '@/utils/objects'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { LucideImagePlus, LucideLogOut, LucidePenLine } from 'lucide-react'

import s from './user-card.module.scss'

export type UserCardProps = {
  avatar?: null | string
  email: string
  name: string
  onSubmit: (
    data: FormData
  ) => Promise<{ data: UserData } | { error: FetchBaseQueryError | SerializedError }>
}
export const UserCard = ({ name, email, avatar, onSubmit }: UserCardProps) => {
  const [logout] = useLogoutMutation()

  const [avatarIsBeingEdited, setAvatarIsBeingEdited] = useState(false)
  const [nameIsBeingEdited, setNameIsBeingEdited] = useState(false)

  const { setValue, ...form } = useForm<UserProfileFormData>({
    resolver: zodResolver(userDataFormSchema),
    defaultValues: {
      name: name || '',
      avatar: '',
    },
  })

  const submitButtonDisabled =
    form.getValues().name === '' || form.formState.isValidating || !form.formState.isDirty

  const cn = {
    content: clsx(s.content),
    sectionTitle: clsx(s.sectionTitle),
    formSection: clsx(s.formSection),
    footer: clsx(s.footer, (avatarIsBeingEdited || nameIsBeingEdited) && s.notHidden),
    logout: clsx(s.flexRow, (avatarIsBeingEdited || nameIsBeingEdited) && s.hidden),
    // form: clsx(s.form, !isEditing && s.hidden),
    nicknameField: clsx(s.formItem, !nameIsBeingEdited && s.hidden),
    avatarField: clsx(s.avatarContainer, !avatarIsBeingEdited && s.hidden),
    avatarContainer: clsx(s.avatarContainer),

    avatar: clsx(s.avatar),
    avatarEditButton: clsx(s.avatarButton),
    nameEditButton: clsx(s.nicknameButton),
    flexColumn: clsx(s.flexColumn),
    flexRow: clsx(s.flexRow),
    nameContainer: clsx(s.nameContainer),
    name: clsx(s.name),
    email: clsx(s.email),
    avatarInput: clsx(s.highlight),
  }

  const handleSubmit = async (data: UserProfileFormData) => {
    const changed = await getChangedDataFromTwoObjects(data, { email, avatar } as UserData)
    const submitData = objectToFormData(changed)

    const notEmpty = Boolean(Array.from(submitData.keys()).length)

    avatarIsBeingEdited && setAvatarIsBeingEdited(false)
    nameIsBeingEdited && setNameIsBeingEdited(false)
    notEmpty &&
      onSubmit(submitData).then(res => {
        if ('error' in res) {
          changed?.avatar && setAvatarIsBeingEdited(true)
          changed?.name && setNameIsBeingEdited(true)
        }
      })
  }

  const handleCancel = () => {
    avatarIsBeingEdited && setAvatarIsBeingEdited(false)
    nameIsBeingEdited && setNameIsBeingEdited(false)
    form.reset()
  }

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const updateAvatar = useCallback(
    (img: string) => {
      //to make form.isDirty work, change image-input instead?
      img !== avatar && setValue('avatar', img, { shouldDirty: true, shouldTouch: true })
    },
    [avatar, setValue]
  )

  return (
    <>
      <Card className={cn.content}>
        <Typography as={'h1'} className={cn.sectionTitle} variant={'large'}>
          Personal information
        </Typography>
        <Form {...form} setValue={setValue}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <section className={cn.formSection}>
              <FormField
                control={form.control}
                name={'avatar'}
                render={({ field, fieldState }) => (
                  <FormItem className={cn.avatarField}>
                    <FormControl>
                      <>
                        <AvatarImageSelector
                          className={cn.avatarInput}
                          errorMessage={fieldState.error?.message}
                          initialContent={avatar || ''}
                          name={'avatar'}
                          // onValueChange={(img: string) => {
                          //   img !== avatar && field.onChange(img)
                          // }}
                          onValueChange={updateAvatar}
                          value={field.value}
                        />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
              {!avatarIsBeingEdited && (
                <div className={cn.flexRow}>
                  <div className={cn.avatarContainer}>
                    <UserAvatar className={cn.avatar} image={avatar} username={name} />
                    <Button
                      className={cn.avatarEditButton}
                      onClick={() => setAvatarIsBeingEdited(true)}
                      size={'dense'}
                      variant={'secondary'}
                    >
                      {avatar ? <LucidePenLine size={14} /> : <LucideImagePlus size={14} />}
                    </Button>
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name={'name'}
                render={({ field, fieldState }) => (
                  <FormItem className={cn.nicknameField}>
                    <FormControl>
                      <TextField
                        label={'Nickname'}
                        {...field}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {!nameIsBeingEdited && (
                <div className={cn.flexColumn}>
                  <div className={cn.flexRow}>
                    <div className={cn.nameContainer}>
                      <Typography className={cn.name} variant={'h2'}>
                        {name}
                      </Typography>
                      <Button
                        className={cn.nameEditButton}
                        onClick={() => setNameIsBeingEdited(true)}
                        variant={'icon'}
                      >
                        <LucidePenLine size={16} />
                      </Button>
                    </div>
                  </div>
                  <Typography className={cn.email} variant={'subdued'}>
                    {email}
                  </Typography>
                </div>
              )}
            </section>

            <section className={cn.footer}>
              <Button onClick={handleCancel} type={'button'} variant={'secondary'}>
                Cancel
              </Button>
              <Button disabled={submitButtonDisabled} type={'submit'}>
                Save changes
              </Button>
            </section>
            <section className={cn.logout}>
              <Button onClick={handleLogout} variant={'secondary'}>
                <LucideLogOut size={14} />
                Logout
              </Button>
            </section>
          </form>
        </Form>
      </Card>
    </>
  )
}
