import type { LoginResponse, SignUpResponse, UserData } from './types'
import type { SignInData } from '@/features/user/sign-in-form-shema'
import type { SignUpData } from '@/features/user/sign-up-form-shema'

import { baseApi } from '@/services/api'

const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    me: builder.query<UserData, void>({
      query: () => 'v1/auth/me',
      providesTags: ['User'],
    }),
    login: builder.mutation<LoginResponse, SignInData>({
      query: body => ({
        url: 'v1/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    signUp: builder.mutation<SignUpResponse, Pick<SignUpData, 'email' | 'password'>>({
      query: body => ({
        url: 'v1/auth/sign-up',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation, useSignUpMutation } = api
