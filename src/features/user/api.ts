import type { LoginResponse, SignUpResponse, UpdatePasswordData, UserData } from './types'
import type { RootState } from '@/app/store'
import type { SignInData } from '@/features/user/forms/sign-in-form-shema'
import type { SignUpData } from '@/features/user/forms/sign-up-form-shema'

import { baseApi } from '@/services/api'
import { getErrorInformation } from '@/utils'
import { getChangedData, mutateObjectValues } from '@/utils/objects'

const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    me: builder.query<UserData | null, void>({
      async queryFn(_args, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `auth/me`,
          method: 'GET',
        })

        if (result.error) {
          // there is an infinite loop when no data returned (i.e. if the standard query is used)
          return { data: null }
        }

        return { data: result.data as UserData }
      },
      extraOptions: {
        maxRetries: 0,
      },
      providesTags: ['User'],
    }),

    login: builder.mutation<LoginResponse, SignInData>({
      query: body => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response, _meta, _arg) => {
        return getErrorInformation(response)
      },
      invalidatesTags: (response, _error, _args) => (response?.accessToken ? ['User'] : []),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(api.util.updateQueryData('me', undefined, _draft => null))

        try {
          await queryFulfilled
          dispatch(api.util.resetApiState())
        } catch (e) {
          //todo: use toast
          console.warn(e)
          patchResult.undo()
        }
      },
    }),
    signUp: builder.mutation<SignUpResponse, Pick<SignUpData, 'email' | 'password'>>({
      query: body => ({
        url: 'auth/sign-up',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response, _meta, _arg) => {
        return getErrorInformation(response)
      },
      // invalidatesTags: ['User'],
      // invalidatesTags: (response, _error, _args) => (response?.id ? ['User'] : []),
    }),
    updateUserData: builder.mutation<UserData, FormData>({
      query: body => ({
        url: 'auth/me',
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async (data, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState

        const entries = api.util.selectInvalidatedBy(state, ['User'])

        const patches = []
        let avatarUrl = null as null | string

        for (const { originalArgs } of entries) {
          const patch = dispatch(
            api.util.updateQueryData('me', originalArgs, draft => {
              const user = draft

              if (user) {
                const patchObj = getChangedData(data, user)

                patchObj?.avatar && (avatarUrl = patchObj.avatar)

                mutateObjectValues(user, patchObj)
              }
            })
          )

          patches.push(patch)
        }

        try {
          await queryFulfilled
        } catch (error) {
          if (patches.length) {
            patches.forEach(patch => patch.undo())
          }
          console.error(error)
        } finally {
          avatarUrl && URL.revokeObjectURL(avatarUrl)
        }
      },

      invalidatesTags: ['User'],
    }),
    requestPasswordReset: builder.mutation<void, string>({
      query: email => ({
        body: {
          email,
          html: import.meta.env.PROD
            ? '<h1>Hi, ##name##</h1><p>Follow this <a href="https://studyjet-online.vercel.app/password-set-new/##token##">link</a> to create new password</p>'
            : '<h1>Hi, ##name##</h1><p>Follow this <a href="http://localhost:5173/password-set-new/##token##">link</a> to create new password</p>',
          // html: '<h1>Hi, ##name##</h1><p>Follow this <a href="https://studyjet-online.vercel.app/password-set-new/##token##">link</a> to create new password</p>',
        },
        method: 'POST',
        url: 'auth/recover-password',
      }),
    }),
    updatePassword: builder.mutation<void, UpdatePasswordData>({
      query: ({ password, token }) => ({
        body: {
          password,
        },
        method: 'POST',
        url: `auth/reset-password/${token}`,
      }),
      transformErrorResponse: (response, _meta, _arg) => {
        return getErrorInformation(response)
      },
    }),
  }),
})

export const {
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useUpdateUserDataMutation,
  useUpdatePasswordMutation,
  useRequestPasswordResetMutation,
} = api
