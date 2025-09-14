import { createApi } from '@reduxjs/toolkit/query/react'
import { fakeBaseQuery } from '@/lib/rtkFakeBaseQuery'
import type { User } from '@/types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User, token: string, exp: number }, { email: string, password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<{ user: User, token: string, exp: number }, { email: string, password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
  })
})

export const { useLoginMutation, useRegisterMutation } = authApi
