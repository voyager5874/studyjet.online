import type { LoginResponse, SignUpResponse, UserData } from './types'
import type { SignInData } from '@/features/user/forms/sign-in-form-shema'
import type { SignUpData } from '@/features/user/forms/sign-up-form-shema'

import { baseApi } from '@/services/api'

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
      invalidatesTags: ['User'],
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
          console.log(e)
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
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation, useSignUpMutation } = api
