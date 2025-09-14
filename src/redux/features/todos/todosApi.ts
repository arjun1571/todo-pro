import { createApi } from '@reduxjs/toolkit/query/react'
import type { PagedResponse, Todo } from '@/types'
import { fakeBaseQuery } from '@/lib/rtkFakeBaseQuery'

export type TodosQuery = {
  page?: number
  limit?: number
  status?: string
  search?: string
  sortBy?: 'createdAt' | 'dueDate' | 'priority'
  sortOrder?: 'asc' | 'desc'
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
}

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fakeBaseQuery,
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<PagedResponse<Todo>, TodosQuery | void>({
      query: (q) => ({ url: '/todos', method: 'GET', params: q }),
      providesTags: (result) => result
        ? [...result.data.map(t => ({ type: 'Todos' as const, id: t.id })), { type: 'Todos' as const, id: 'LIST' }]
        : [{ type: 'Todos' as const, id: 'LIST' }]
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({ url: '/todos', method: 'POST', body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(todosApi.util.updateQueryData('getTodos', { page: 1, limit: 10 }, (draft) => {
          const optimistic = {
            id: 'tmp-' + Math.random().toString(36).slice(2),
            title: arg.title ?? '',
            description: arg.description,
            status: (arg.status as any) ?? 'todo',
            priority: arg.priority,
            tags: arg.tags ?? [],
            dueDate: arg.dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          draft.data.unshift(optimistic as any)
          draft.total += 1
        }))
        try { await queryFulfilled } catch { patch.undo() }
      },
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    }),
    updateTodo: builder.mutation<Todo, Partial<Todo> & Pick<Todo,'id'>>({
      query: ({ id, ...rest }) => ({ url: `/todos/${id}`, method: 'PATCH', body: rest }),
      async onQueryStarted({ id, ...rest }, { dispatch, queryFulfilled, getState }) {
        const queries = todosApi.util.selectInvalidatedBy(getState(), [{ type: 'Todos', id: 'LIST' }])
        const patches = queries.map(({ originalArgs }) =>
          dispatch(todosApi.util.updateQueryData('getTodos', originalArgs, (draft) => {
            const idx = draft.data.findIndex(t => t.id === id)
            if (idx >= 0) draft.data[idx] = { ...draft.data[idx], ...rest, updatedAt: new Date().toISOString() }
          }))
        )
        try { await queryFulfilled } catch { patches.forEach(p => p.undo()) }
      },
      invalidatesTags: (r,e,{id}) => [{ type: 'Todos', id }]
    }),
    deleteTodo: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/todos/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const queries = todosApi.util.selectInvalidatedBy(getState(), [{ type: 'Todos', id: 'LIST' }])
        const patches = queries.map(({ originalArgs }) =>
          dispatch(todosApi.util.updateQueryData('getTodos', originalArgs, (draft) => {
            const idx = draft.data.findIndex(t => t.id === id)
            if (idx >= 0) { draft.data.splice(idx,1); draft.total -= 1 }
          }))
        )
        try { await queryFulfilled } catch { patches.forEach(p => p.undo()) }
      },
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    }),
  })
})

export const { useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = todosApi
