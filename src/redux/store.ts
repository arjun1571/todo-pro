import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import uiReducer from "@/redux/features/ui/uiSlice";
import { todosApi } from "@/redux/features/todos/todosApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/redux/features/auth/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [todosApi.reducerPath]: todosApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(todosApi.middleware, authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
