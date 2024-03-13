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
import { AvatarImageSelector } from '@/ui/image-input/avatar-image-selector'
import { TextField } from '@/ui/text-field'
import { useToast } from '@/ui/toast'
import { Typography } from '@/ui/typography'
import { getChangedDataFromTwoObjects, objectToFormData } from '@/utils/objects'
import { DevTool } from '@hookform/devtools'
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

  const { register, ...form } = useForm<UserProfileFormData>({
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
  const { toast } = useToast()
  const handleLogout = useCallback(() => {
    logout()
      .unwrap()
      .catch(err => {
        toast({
          type: 'foreground',
          from: 'right',
          position: 'bottomRight',
          variant: 'warning',
          title: "Couldn't log out",
          description: err || '',
        })
      })
  }, [logout, toast])

  return (
    <>
      <Card className={cn.content}>
        <Typography as={'h1'} className={cn.sectionTitle} variant={'large'}>
          Personal information
        </Typography>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <section className={cn.formSection}>
            {avatarIsBeingEdited && (
              <AvatarImageSelector
                className={cn.avatarInput}
                errorMessage={form.formState.errors.avatar?.message}
                initialContent={avatar || ''}
                {...register('avatar')}
              />
            )}
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
            {nameIsBeingEdited && (
              <TextField
                errorMessage={form.formState.errors.name?.message}
                label={'Nickname'}
                {...register('name')}
              />
            )}
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
      </Card>
      {import.meta.env.DEV && <DevTool control={form.control} />}
    </>
  )
}
