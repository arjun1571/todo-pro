import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { mockApi } from "./mockApi";
import type { RootState } from "@/redux/store";

// Map URLs to mockApi functions
export const fakeBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: any; params?: any },
  unknown,
  { status?: number; data?: any }
> = async (args, api) => {
  const state = api.getState() as RootState;
  const token = state.auth.token ?? undefined;
  try {
    if (args.url.startsWith("/auth/login") && args.method === "POST") {
      const data = await mockApi.login(args.body);
      return { data };
    }
    if (args.url.startsWith("/auth/register") && args.method === "POST") {
      const data = await mockApi.register(args.body);
      return { data };
    }
    if (
      args.url.startsWith("/todos") &&
      (!args.method || args.method === "GET")
    ) {
      const data = await mockApi.getTodos(args.params ?? {}, token);
      return { data };
    }
    if (args.url.startsWith("/todos") && args.method === "POST") {
      const data = await mockApi.addTodo(args.body, token);
      return { data };
    }
    if (args.url.startsWith("/todos/") && args.method === "PATCH") {
      const id = args.url.split("/").pop()!;
      const data = await mockApi.updateTodo(id, args.body, token);
      return { data };
    }
    if (args.url.startsWith("/todos/") && args.method === "DELETE") {
      const id = args.url.split("/").pop()!;
      const data = await mockApi.deleteTodo(id, token);
      return { data };
    }
    return { error: { status: 404, data: { message: "Unknown endpoint" } } };
  } catch (e: any) {
    return {
      error: {
        status: e?.status ?? 500,
        data: { message: e?.message ?? "Error" },
      },
    };
  }
};
