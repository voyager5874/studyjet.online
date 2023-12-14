import type { LoginResponse, UserData } from './types'
import type { LoginParameters } from '@/features/user/sign-in-form-shema'

import { baseApi } from '@/services/api'

const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    me: builder.query<UserData, void>({
      query: () => 'v1/auth/me',
      providesTags: ['User'],
    }),
    login: builder.mutation<LoginResponse, LoginParameters>({
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
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = api
